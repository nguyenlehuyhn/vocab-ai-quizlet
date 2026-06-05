import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", request.url));
}
