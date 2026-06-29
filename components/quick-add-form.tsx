"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type PendingStatus = "saved" | "duplicate" | "failed";

type PendingWord = {
  id: string;
  word: string;
  status: PendingStatus;
  message: string;
};

type ApiPayload = {
  status?: "success" | "duplicate" | "error";
  message?: string;
  error?: string;
  details?: {
    code?: string;
    details?: string;
    hint?: string;
    message?: string;
    name?: string;
  };
};

function statusLabel(status: PendingStatus) {
  if (status === "saved") return "Saved";
  if (status === "duplicate") return "Already exists";
  return "Failed";
}

function statusClass(status: PendingStatus) {
  if (status === "saved") return "bg-emerald-50 text-emerald-700";
  if (status === "duplicate") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export function QuickAddForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [word, setWord] = useState("");
  const [pendingWords, setPendingWords] = useState<PendingWord[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = word.trim();
    if (!trimmed) {
      return;
    }

    const id = crypto.randomUUID();
    setWord("");
    setPendingWords((currentWords) => [
      { id, word: trimmed, status: "saved", message: "Saved" },
      ...currentWords
    ]);
    inputRef.current?.focus();

    void submitWord(id, trimmed);
  }

  async function submitWord(id: string, submittedWord: string) {
    console.log("[quick add] submitting word", submittedWord);

    const response = await fetch("/api/vocab/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: submittedWord })
    }).catch((error) => {
      console.error("[quick add] request failed", error);
      return null;
    });

    if (!response) {
      updatePendingWord(id, "failed", "Network error.");
      return;
    }

    const payload = (await response.json().catch((error) => {
      console.error("[quick add] failed to parse API response", error);
      return null;
    })) as ApiPayload | null;

    console.log("[quick add] full API response", {
      ok: response.ok,
      status: response.status,
      payload
    });

    if (payload?.status === "success") {
      updatePendingWord(id, "saved", "Saved");
      return;
    }

    if (payload?.status === "duplicate") {
      updatePendingWord(id, "duplicate", "Already exists");
      return;
    }

    if (payload?.details) {
      console.error("[quick add] full Supabase/API error details", payload.details);
    }

    updatePendingWord(id, "failed", getErrorMessage(payload, response.status));
  }

  function getErrorMessage(payload: ApiPayload | null, status: number) {
    return (
      payload?.details?.message ??
      payload?.message ??
      payload?.error ??
      `Request failed with status ${status}`
    );
  }

  function updatePendingWord(id: string, status: PendingStatus, message: string) {
    setPendingWords((currentWords) =>
      currentWords.map((pendingWord) => (pendingWord.id === id ? { ...pendingWord, status, message } : pendingWord))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          autoCapitalize="none"
          autoComplete="off"
          className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-6 text-2xl font-bold text-slate-950 shadow-sm outline-none ring-teal-600/20 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4"
          maxLength={80}
          placeholder="English word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />
        <button
          className="w-full rounded-3xl bg-teal-700 px-5 py-5 text-lg font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!word.trim()}
          type="submit"
        >
          Add word
        </button>
      </form>

      {pendingWords.length ? (
        <div className="flex flex-col gap-2">
          {pendingWords.map((pendingWord) => (
            <div key={pendingWord.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-base font-bold text-slate-950">{pendingWord.word}</p>
                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusClass(pendingWord.status)}`}>
                  {statusLabel(pendingWord.status)}
                </span>
              </div>
              {pendingWord.status === "failed" ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-red-700">{pendingWord.message}</p>
                  <button
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white"
                    type="button"
                    onClick={() => {
                      updatePendingWord(pendingWord.id, "saved", "Saved");
                      void submitWord(pendingWord.id, pendingWord.word);
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <Link className="text-center text-sm font-bold text-slate-600 underline-offset-4 hover:underline" href="/app">
        View vocabulary
      </Link>
    </div>
  );
}
