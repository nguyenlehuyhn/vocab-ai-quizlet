import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildQuizletDefinition } from "@/lib/quizlet-format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export const runtime = "nodejs";

const requestSchema = z.object({
  word: z.string().trim().min(1).max(80)
});

const generatedSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  vietnamese_meaning: z.string(),
  english_example: z.string(),
  quizlet_term: z.string(),
  quizlet_definition: z.string()
});

const responseFormat = {
  type: "json_schema" as const,
  name: "vocab_item",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["word", "pronunciation", "vietnamese_meaning", "english_example", "quizlet_term", "quizlet_definition"],
    properties: {
      word: { type: "string" },
      pronunciation: { type: "string" },
      vietnamese_meaning: { type: "string" },
      english_example: { type: "string" },
      quizlet_term: { type: "string" },
      quizlet_definition: { type: "string" }
    }
  }
};

function normalizeWord(word: string) {
  return word.trim().toLowerCase();
}

type ErrorDetails = {
  code?: string;
  details?: string;
  hint?: string;
  message?: string;
  name?: string;
};

function errorResponse(message: string, status = 500, details?: ErrorDetails) {
  return NextResponse.json({ status: "error", message, error: message, details }, { status });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Please sign in first.", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Enter one English word or phrase.", 400);
  }

  const normalizedWord = normalizeWord(parsed.data.word);
  console.log("[vocab generate] word being submitted", {
    word: parsed.data.word,
    normalizedWord,
    userId: user.id
  });

  const { data: existingItem, error: duplicateCheckError } = await supabase
    .from("vocab_items")
    .select("id, word")
    .eq("user_id", user.id)
    .eq("normalized_word", normalizedWord)
    .maybeSingle();

  console.log("[vocab generate] duplicate check result", {
    existingItem,
    duplicateCheckError
  });

  if (duplicateCheckError) {
    console.error("[vocab generate] duplicate check error", duplicateCheckError);
    return errorResponse(duplicateCheckError.message, 500, duplicateCheckError);
  }

  if (existingItem) {
    return NextResponse.json({
      status: "duplicate",
      message: "This word already exists.",
      item: existingItem
    });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let adminSupabase: ReturnType<typeof createAdminClient>;

  try {
    adminSupabase = createAdminClient();
  } catch {
    return errorResponse("Missing server environment variables.");
  }

  const { count, error: countError } = await adminSupabase
    .from("vocab_generation_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if (countError) {
    return errorResponse("Could not check today's limit.");
  }

  if ((count ?? 0) >= 30) {
    return errorResponse("Daily limit reached. You can add 30 words per day.", 429);
  }

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse("Missing OPENAI_API_KEY on the server.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "For the given English word or phrase, return JSON only. Vietnamese meaning should be concise and natural. English example should be simple, useful, and natural. pronunciation should be IPA style when possible, wrapped in slashes, such as /əˈfɪlieɪt/. quizlet_term should be exactly the English word or phrase. quizlet_definition must never repeat the English word or phrase. quizlet_definition should contain only the Vietnamese meaning, then '. Example: ', then the English example."
        },
        {
          role: "user",
          content: parsed.data.word
        }
      ],
      text: { format: responseFormat }
    });

    const generated = generatedSchema.parse(JSON.parse(response.output_text));
    const insertPayload = {
      user_id: user.id,
      word: generated.word,
      normalized_word: normalizedWord,
      pronunciation: generated.pronunciation,
      vietnamese_meaning: generated.vietnamese_meaning,
      english_example: generated.english_example,
      quizlet_term: generated.quizlet_term,
      quizlet_definition: buildQuizletDefinition(generated.vietnamese_meaning, generated.english_example)
    };

    console.log("[vocab generate] insert payload", insertPayload);

    const { data: item, error: insertError } = await supabase
      .from("vocab_items")
      .insert(insertPayload)
      .select()
      .single();

    console.log("[vocab generate] insert response", {
      item,
      insertError
    });

    if (insertError) {
      console.error("[vocab generate] full Supabase insert error", insertError);

      if (insertError.code === "23505") {
        return NextResponse.json({
          status: "duplicate",
          message: "This word already exists.",
          details: insertError
        });
      }

      return errorResponse(insertError.message, 500, insertError);
    }

    const { error: logError } = await adminSupabase.from("vocab_generation_logs").insert({ user_id: user.id });

    if (logError) {
      return errorResponse("Could not record today's usage.");
    }

    return NextResponse.json({ status: "success", item });
  } catch {
    return errorResponse("AI generation failed. Please try again.");
  }
}
