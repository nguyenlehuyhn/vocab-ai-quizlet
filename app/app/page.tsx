import Link from "next/link";
import { redirect } from "next/navigation";
import { AddWordForm } from "@/components/add-word-form";
import { SavedWordsList } from "@/components/saved-words-list";
import { createServerClient } from "@/lib/supabase/server";

export default async function AppPage() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: items, error } = await supabase
    .from("vocab_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6">
      <nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Link className="text-sm font-semibold text-teal-700" href="/app">
          App
        </Link>
        <Link className="text-sm font-semibold text-slate-700" href="/app/export">
          Export
        </Link>
        <Link className="text-sm font-semibold text-slate-700" href="/app/settings">
          Settings
        </Link>
      </nav>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">Add vocabulary</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Learn one word at a time</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter an English word or phrase. AI will create a Vietnamese meaning and a simple English example.
        </p>
        <AddWordForm />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">Recent</p>
            <h2 className="text-xl font-bold text-slate-950">Saved words</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {items?.length ?? 0}
          </span>
        </div>
        {error ? (
          <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            Could not load saved words. Please refresh the page.
          </p>
        ) : (
          <SavedWordsList items={items ?? []} />
        )}
      </section>
    </main>
  );
}
