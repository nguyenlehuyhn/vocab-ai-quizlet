"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

export function QuickAddForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [savedWord, setSavedWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSavedWord("");

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

    if (!response.ok) {
      setError(payload.error ?? "Something went wrong. Please try again.");
      return;
    }

    setWord("");
    setSavedWord(payload.item.word);
  }

  function addAnother() {
    setError("");
    setSavedWord("");
    setWord("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          autoCapitalize="none"
          autoComplete="off"
          className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-6 text-2xl font-bold text-slate-950 shadow-sm outline-none ring-teal-600/20 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4"
          disabled={isLoading}
          maxLength={80}
          placeholder="English word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />
        <button
          className="w-full rounded-3xl bg-teal-700 px-5 py-5 text-lg font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Adding..." : "Add word"}
        </button>
      </form>

      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}

      {savedWord ? (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700">Saved {savedWord}</p>
          <button className="mt-3 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white" type="button" onClick={addAnother}>
            Add another
          </button>
        </div>
      ) : null}

      <Link className="text-center text-sm font-bold text-slate-600 underline-offset-4 hover:underline" href="/app">
        View vocabulary
      </Link>
    </div>
  );
}
