import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyExportButton } from "@/components/copy-export-button";
import { createServerClient } from "@/lib/supabase/server";

export default async function ExportPage() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: items, error } = await supabase
    .from("vocab_items")
    .select("quizlet_term, quizlet_definition")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const exportText =
    items
      ?.map((item) => `${item.quizlet_term ?? ""}\t${item.quizlet_definition ?? ""}`)
      .join("\n") ?? "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6">
      <nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Link className="text-sm font-semibold text-slate-700" href="/app">
          App
        </Link>
        <Link className="text-sm font-semibold text-teal-700" href="/app/export">
          Export
        </Link>
        <Link className="text-sm font-semibold text-slate-700" href="/app/settings">
          Settings
        </Link>
      </nav>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Quizlet import</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Copy your saved words</h1>
          </div>
          <CopyExportButton text={exportText} />
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            Could not load export text. Please try again.
          </p>
        ) : (
          <textarea
            className="h-96 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none"
            readOnly
            value={exportText || "No saved words yet."}
          />
        )}
      </section>
    </main>
  );
}
