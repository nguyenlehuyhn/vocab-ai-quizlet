import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { ExportPanel } from "@/components/export-panel";
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
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6">
      <AppNav active="export" />

      {error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          Could not load export text. Please try again.
        </p>
      ) : (
        <ExportPanel items={items ?? []} />
      )}
    </main>
  );
}
