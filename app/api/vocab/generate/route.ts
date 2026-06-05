import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export const runtime = "nodejs";

const requestSchema = z.object({
  word: z.string().trim().min(1).max(80)
});

const generatedSchema = z.object({
  word: z.string(),
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
    required: ["word", "vietnamese_meaning", "english_example", "quizlet_term", "quizlet_definition"],
    properties: {
      word: { type: "string" },
      vietnamese_meaning: { type: "string" },
      english_example: { type: "string" },
      quizlet_term: { type: "string" },
      quizlet_definition: { type: "string" }
    }
  }
};

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter one English word or phrase." }, { status: 400 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const adminSupabase = createAdminClient();

  const { count, error: countError } = await adminSupabase
    .from("vocab_generation_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if (countError) {
    return NextResponse.json({ error: "Could not check today's limit." }, { status: 500 });
  }

  if ((count ?? 0) >= 30) {
    return NextResponse.json({ error: "Daily limit reached. You can add 30 words per day." }, { status: 429 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY on the server." }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "For the given English word or phrase, return JSON only. Vietnamese meaning should be concise and natural. English example should be simple, useful, and natural. quizlet_term should be the English word. quizlet_definition should include Vietnamese meaning and the English example."
        },
        {
          role: "user",
          content: parsed.data.word
        }
      ],
      text: { format: responseFormat }
    });

    const generated = generatedSchema.parse(JSON.parse(response.output_text));

    const { data: item, error: insertError } = await supabase
      .from("vocab_items")
      .insert({
        user_id: user.id,
        word: generated.word,
        vietnamese_meaning: generated.vietnamese_meaning,
        english_example: generated.english_example,
        quizlet_term: generated.quizlet_term,
        quizlet_definition: generated.quizlet_definition
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Could not save this word." }, { status: 500 });
    }

    const { error: logError } = await adminSupabase.from("vocab_generation_logs").insert({ user_id: user.id });

    if (logError) {
      return NextResponse.json({ error: "Could not record today's usage." }, { status: 500 });
    }

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 });
  }
}
