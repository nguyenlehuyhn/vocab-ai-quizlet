"use client";

import { useMemo, useState } from "react";
import { CopyExportButton } from "@/components/copy-export-button";
import { DateFilterControls } from "@/components/filter-controls";
import { filterVocabItems, type DateFilterValue } from "@/lib/vocab-filters";
import type { VocabItem } from "@/lib/types";

export function ExportPanel({ items }: { items: VocabItem[] }) {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");
  const [customDate, setCustomDate] = useState("");

  const filteredItems = useMemo(
    () => filterVocabItems(items, { dateFilter, customDate }),
    [customDate, dateFilter, items]
  );

  const exportText = filteredItems
    .map((item) => `${item.quizlet_term ?? item.word}\t${item.quizlet_definition ?? item.vietnamese_meaning ?? ""}`)
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
          customDate={customDate}
          dateFilter={dateFilter}
          onCustomDateChange={setCustomDate}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <textarea
        className="h-96 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none"
        readOnly
        value={exportText || "No words match this filter."}
      />
    </section>
  );
}
