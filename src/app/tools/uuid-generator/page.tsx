"use client";

import { useState, useEffect } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

type UuidFormat = "standard" | "uppercase" | "no-hyphens" | "braces" | "quotes";

const generateUuidV4 = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatUuid = (uuid: string, format: UuidFormat) => {
  switch (format) {
    case "uppercase":
      return uuid.toUpperCase();
    case "no-hyphens":
      return uuid.replace(/-/g, "");
    case "braces":
      return `{${uuid}}`;
    case "quotes":
      return `"${uuid}"`;
    case "standard":
    default:
      return uuid;
  }
};

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(5);
  const [format, setFormat] = useState<UuidFormat>("standard");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Raw UUIDs; formatting is applied at render time so format changes apply instantly.
  const [uuids, setUuids] = useState<string[]>([]);

  // Hydration fix: random values must be generated after mount, not during SSR
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUuids(Array.from({ length: 5 }, generateUuidV4));
  }, []);

  const generateUuids = () => {
    setUuids(Array.from({ length: Math.min(Math.max(count, 1), 500) }, generateUuidV4));
    setCopiedIndex(null);
  };

  const formatted = uuids.map((uuid) => formatUuid(uuid, format));

  const copyOne = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <ToolLayout
      glow="top-0 left-0 bg-emerald-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">UUID / GUID</span> Generator
        </>
      }
      description="Generate random, unique Version 4 UUIDs (Universally Unique Identifiers) instantly in your browser. Perfect for database keys, session IDs, and unique token generation."
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Controls Panel */}
        <div className="md:col-span-1 space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md h-fit">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">How many to generate?</label>
            <input
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-2">Max 500 at once</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Format</label>
            <div className="space-y-2">
              {(["standard", "uppercase", "no-hyphens", "braces", "quotes"] as UuidFormat[]).map((fmt) => (
                <label key={fmt} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="format"
                      value={fmt}
                      checked={format === fmt}
                      onChange={() => setFormat(fmt)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border border-slate-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/20 transition-all"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 absolute scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors capitalize">
                    {fmt.replace("-", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateUuids}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
          >
            Generate New UUIDs
          </button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
            <span className="text-sm font-medium text-slate-300">Generated {uuids.length} UUID(s)</span>
            <CopyButton text={formatted.join("\n")} label="Copy All" />
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-inner max-h-[600px] overflow-y-auto custom-scrollbar">
            <ul className="divide-y divide-white/5">
              {formatted.map((uuid, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center px-6 py-3 hover:bg-white/5 transition-colors group"
                >
                  <code className="text-emerald-400 font-mono text-sm tracking-widest">{uuid}</code>
                  <button
                    onClick={() => copyOne(uuid, index)}
                    className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                    title="Copy this UUID"
                  >
                    {copiedIndex === index ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
