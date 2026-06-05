import type { VocabItem } from "@/lib/types";

export function SavedWordsList({ items }: { items: VocabItem[] }) {
  if (!items.length) {
    return (
      <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
        No words yet. Add your first word above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-950">{item.word}</h3>
            <time className="text-xs font-semibold text-slate-500">
              {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(item.created_at))}
            </time>
          </div>
          <p className="mt-2 text-base font-semibold text-teal-800">{item.vietnamese_meaning}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.english_example}</p>
        </article>
      ))}
    </div>
  );
}
