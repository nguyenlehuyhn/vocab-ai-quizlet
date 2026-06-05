"use client";

import { createBrowserClient } from "@/lib/supabase/browser";

export function LoginButton() {
  async function signInWithGoogle() {
    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  return (
    <button
      className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-800"
      type="button"
      onClick={signInWithGoogle}
    >
      Continue with Google
    </button>
  );
}
