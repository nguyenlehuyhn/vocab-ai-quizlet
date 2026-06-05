"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function AddWordForm() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = word.trim();
    if (!trimmed) {
      setError("Enter one English word or phrase.");
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/vocab/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: trimmed })
    });

    const payload = await response.json();
    setIsLoading(false);

    if (payload.status === "duplicate") {
      setSuccess("Already exists.");
      return;
    }

    if (!response.ok || payload.status !== "success") {
      setError(payload.message ?? payload.error ?? "Something went wrong. Please try again.");
      return;
    }

    setWord("");
    setSuccess(`Saved "${payload.item.word}".`);
    startTransition(() => router.refresh());
  }

  return (
    <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-xl font-semibold text-slate-950 outline-none ring-teal-600/20 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4"
        disabled={isLoading || isPending}
        maxLength={80}
        placeholder="e.g. thoughtful"
        value={word}
        onChange={(event) => setWord(event.target.value)}
      />
      <button
        className="w-full rounded-2xl bg-teal-700 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isLoading || isPending}
        type="submit"
      >
        {isLoading || isPending ? "Adding..." : "Add word"}
      </button>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</p> : null}
    </form>
  );
}
