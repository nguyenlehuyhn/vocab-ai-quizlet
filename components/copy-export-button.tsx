"use client";

import { useState } from "react";

export function CopyExportButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-bold text-white disabled:bg-slate-400"
      disabled={!text}
      type="button"
      onClick={copyText}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
