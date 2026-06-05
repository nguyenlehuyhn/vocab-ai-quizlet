import type { VocabItem } from "@/lib/types";

export type DateFilterValue = "today" | "week" | "month" | "all" | "starred";

type FilterOptions = {
  dateFilter: DateFilterValue;
  query?: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isThisWeek(date: Date, now: Date) {
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const weekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return date >= weekStart && date < weekEnd;
}

function matchesDateFilter(item: VocabItem, dateFilter: DateFilterValue) {
  if (dateFilter === "all") return true;
  if (dateFilter === "starred") return item.is_starred;

  const createdAt = new Date(item.created_at);
  const now = new Date();

  if (dateFilter === "today") {
    return isSameDay(createdAt, now);
  }

  if (dateFilter === "week") {
    return isThisWeek(createdAt, now);
  }

  if (dateFilter === "month") {
    return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
  }

  return true;
}

function matchesSearch(item: VocabItem, query?: string) {
  const normalizedQuery = query?.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [item.word, item.vietnamese_meaning, item.english_example]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedQuery));
}

export function filterVocabItems(items: VocabItem[], options: FilterOptions) {
  return items.filter((item) => matchesDateFilter(item, options.dateFilter) && matchesSearch(item, options.query));
}
