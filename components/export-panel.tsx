"use client";

import { useMemo, useState } from "react";
import { CopyExportButton } from "@/components/copy-export-button";
import { DateFilterControls } from "@/components/filter-controls";
import { buildQuizletDefinition } from "@/lib/quizlet-format";
import { filterVocabItems, type DateFilterValue } from "@/lib/vocab-filters";
import type { VocabItem } from "@/lib/types";

export function ExportPanel({ items }: { items: VocabItem[] }) {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");

  const filteredItems = useMemo(
    () => filterVocabItems(items, { dateFilter }),
    [dateFilter, items]
  );

  const exportText = filteredItems
    .map((item) => `${item.quizlet_term ?? item.word}\t${buildQuizletDefinition(item.vietnamese_meaning, item.english_example)}`)
    .join("\n");

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Quizlet import</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Copy filtered words</h1>
        </div>
        <CopyExportButton text={exportText} />
      </div>

      <div className="mb-4">
        <DateFilterControls
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <textarea
        className="h-96 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none"
        readOnly
        value={exportText || "No words match this filter."}
      />

      {filteredItems.length ? (
        <div className="mt-5 grid gap-3">
          <h2 className="text-sm font-bold text-slate-700">Preview</h2>
          {filteredItems.slice(0, 8).map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-base font-bold text-slate-950">{item.word}</p>
                <p className="text-sm font-semibold text-slate-500">{item.pronunciation || "-"}</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{buildQuizletDefinition(item.vietnamese_meaning, item.english_example)}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
