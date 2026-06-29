"use client";

import { useMemo, useState } from "react";
import { DateFilterControls } from "@/components/filter-controls";
import { createBrowserClient } from "@/lib/supabase/browser";
import { filterVocabItems, type DateFilterValue } from "@/lib/vocab-filters";
import type { VocabItem } from "@/lib/types";

export function VocabularyDashboard({ items }: { items: VocabItem[] }) {
  const [localItems, setLocalItems] = useState(items);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");
  const [actionError, setActionError] = useState("");

  const filteredItems = useMemo(
    () => filterVocabItems(localItems, { dateFilter, query }),
    [dateFilter, localItems, query]
  );

  async function toggleStar(item: VocabItem) {
    setActionError("");
    const nextStarred = !item.is_starred;
    setLocalItems((currentItems) =>
      currentItems.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, is_starred: nextStarred } : currentItem))
    );

    const supabase = createBrowserClient();
    const { error } = await supabase.from("vocab_items").update({ is_starred: nextStarred }).eq("id", item.id);

    if (error) {
      setLocalItems((currentItems) =>
        currentItems.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, is_starred: item.is_starred } : currentItem))
      );
      setActionError("Could not update starred status.");
    }
  }

  async function deleteItem(item: VocabItem) {
    if (!window.confirm(`Delete "${item.word}"?`)) return;

    setActionError("");
    setLocalItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));

    const response = await fetch(`/api/vocab/${item.id}`, { method: "DELETE" });

    if (!response.ok) {
      setLocalItems((currentItems) => [item, ...currentItems]);
      setActionError("Could not delete this word.");
    }
  }

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
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      {actionError ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{actionError}</p> : null}

      <div className="mt-5 grid gap-3 md:hidden">
        {filteredItems.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-950">{item.word}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{item.pronunciation || "-"}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  aria-label={item.is_starred ? `Unstar ${item.word}` : `Star ${item.word}`}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-amber-500"
                  type="button"
                  onClick={() => toggleStar(item)}
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill={item.is_starred ? "currentColor" : "none"} viewBox="0 0 24 24">
                    <path
                      d="m12 3.5 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3.5Z"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </button>
                <button
                  aria-label={`Delete ${item.word}`}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-red-600"
                  type="button"
                  onClick={() => deleteItem(item)}
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 7h12m-10 0 .7 12h6.6L16 7M9.5 7l.5-2h4l.5 2M10 10.5v5M14 10.5v5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-teal-800">{item.vietnamese_meaning}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.english_example}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Actions</th>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Word</th>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Pronunciation</th>
              <th className="border-b border-r border-slate-200 px-3 py-3 font-bold">Vietnamese meaning</th>
              <th className="border-b border-slate-200 px-3 py-3 font-bold">Example</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="align-top odd:bg-white even:bg-slate-50">
                <td className="whitespace-nowrap border-r border-slate-200 px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      aria-label={item.is_starred ? `Unstar ${item.word}` : `Star ${item.word}`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-amber-500 hover:bg-amber-50"
                      type="button"
                      onClick={() => toggleStar(item)}
                    >
                      <svg aria-hidden="true" className="h-5 w-5" fill={item.is_starred ? "currentColor" : "none"} viewBox="0 0 24 24">
                        <path
                          d="m12 3.5 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3.5Z"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                    <button
                      aria-label={`Delete ${item.word}`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-red-600 hover:bg-red-50"
                      type="button"
                      onClick={() => deleteItem(item)}
                    >
                      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M6 7h12m-10 0 .7 12h6.6L16 7M9.5 7l.5-2h4l.5 2M10 10.5v5M14 10.5v5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-3 font-bold text-slate-950">{item.word}</td>
                <td className="border-r border-slate-200 px-3 py-3 text-sm font-semibold text-slate-500">{item.pronunciation || "-"}</td>
                <td className="border-r border-slate-200 px-3 py-3 text-teal-800">{item.vietnamese_meaning}</td>
                <td className="px-3 py-3 text-slate-700">{item.english_example}</td>
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
