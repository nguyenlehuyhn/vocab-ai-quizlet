import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export const runtime = "nodejs";

function errorResponse(message: string, status = 500) {
  return NextResponse.json({ status: "error", message }, { status });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Please sign in first.", 401);
  }

  let adminSupabase: ReturnType<typeof createAdminClient>;

  try {
    adminSupabase = createAdminClient();
  } catch {
    return errorResponse("Missing server environment variables.");
  }

  const { data, error } = await adminSupabase
    .from("vocab_items")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    return errorResponse("Could not delete this word.", 404);
  }

  return NextResponse.json({ status: "success", id: data.id });
}
