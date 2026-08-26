"use client";

import { useState } from "react";

// Copy-to-clipboard button with a self-resetting "Copied!" state.
// Pass idleClass/copiedClass to keep each tool's accent color.
export default function CopyButton({
  text,
  label = "Copy",
  idleClass = "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  copiedClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
}: {
  text: string;
  label?: string;
  idleClass?: string;
  copiedClass?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`text-sm flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${
        !text
          ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
          : copied
            ? copiedClass
            : idleClass
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
