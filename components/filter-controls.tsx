"use client";

import type { DateFilterValue } from "@/lib/vocab-filters";

const dateOptions: { label: string; value: DateFilterValue }[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "All", value: "all" },
  { label: "Starred", value: "starred" }
];

type DateFilterControlsProps = {
  dateFilter: DateFilterValue;
  onDateFilterChange: (value: DateFilterValue) => void;
};

export function DateFilterControls({ dateFilter, onDateFilterChange }: DateFilterControlsProps) {
  return (
    <div className="grid gap-3">
      <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
        Filter
        <select
          className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none ring-teal-600/20 focus:border-teal-600 focus:ring-4"
          value={dateFilter}
          onChange={(event) => onDateFilterChange(event.target.value as DateFilterValue)}
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
