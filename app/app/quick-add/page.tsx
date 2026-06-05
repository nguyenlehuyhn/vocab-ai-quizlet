import { redirect } from "next/navigation";
import { QuickAddForm } from "@/components/quick-add-form";
import { createServerClient } from "@/lib/supabase/server";

export default async function QuickAddPage() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-950">Add vocabulary</h1>
        <div className="mt-6">
          <QuickAddForm />
        </div>
      </section>
    </main>
  );
}
