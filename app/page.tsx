import { redirect } from "next/navigation";
import { LoginButton } from "@/components/login-button";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">Vocab AI Quizlet</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Save better vocabulary cards.</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Sign in with Google, add an English word, generate a Vietnamese meaning and example, then export to Quizlet.
        </p>
        <div className="mt-7">
          <LoginButton />
        </div>
      </section>
    </main>
  );
}
