import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6">
      <nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Link className="text-sm font-semibold text-slate-700" href="/app">
          App
        </Link>
        <Link className="text-sm font-semibold text-slate-700" href="/app/export">
          Export
        </Link>
        <Link className="text-sm font-semibold text-teal-700" href="/app/settings">
          Settings
        </Link>
      </nav>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">Account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Settings</h1>
        <p className="mt-3 text-sm text-slate-600">{user.email}</p>
        <form action="/auth/sign-out" method="post" className="mt-5">
          <button className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-bold text-white" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
