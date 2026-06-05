"use client";

import { useMemo, useState } from "react";
import { DateFilterControls } from "@/components/filter-controls";
import { filterVocabItems, type DateFilterValue } from "@/lib/vocab-filters";
import type { VocabItem } from "@/lib/types";

export function VocabularyDashboard({ items }: { items: VocabItem[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");
  const [customDate, setCustomDate] = useState("");

  const filteredItems = useMemo(
    () => filterVocabItems(items, { customDate, dateFilter, query }),
    [customDate, dateFilter, items, query]
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-teal-700">Vocabulary</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Saved words</h1>
      </div>

      <div className="grid gap-3">
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
          Search
          <input
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none ring-teal-600/20 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4"
            placeholder="Search word, meaning, or example"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <DateFilterControls
          customDate={customDate}
          dateFilter={dateFilter}
          onCustomDateChange={setCustomDate}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Word</th>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Vietnamese meaning</th>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Example</th>
              <th className="border-b border-slate-200 px-3 py-3 font-bold">Created date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="align-top odd:bg-white even:bg-slate-50">
                <td className="border-r border-slate-200 px-3 py-3 font-bold text-slate-950">{item.word}</td>
                <td className="border-r border-slate-200 px-3 py-3 text-teal-800">{item.vietnamese_meaning}</td>
                <td className="border-r border-slate-200 px-3 py-3 text-slate-700">{item.english_example}</td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(item.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!filteredItems.length ? (
        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
          No words match this search and filter.
        </p>
      ) : null}
    </section>
  );
}
