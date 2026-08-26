"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortDeep((value as Record<string, unknown>)[k])])
    );
  }
  return value;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [sortKeys, setSortKeys] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      let parsed: unknown = JSON.parse(input);
      if (sortKeys) parsed = sortDeep(parsed);
      const out =
        mode === "minify"
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, indent === "tab" ? "\t" : Number(indent));
      return { output: out ?? "", error: null };
    } catch (e: unknown) {
      return { output: "", error: e instanceof Error ? `Invalid JSON: ${e.message}` : "Invalid JSON" };
    }
  }, [input, mode, indent, sortKeys]);

  const tabClass = (active: boolean) =>
    `flex-1 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${
      active ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <ToolLayout
      glow="top-0 right-0 bg-indigo-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">JSON</span> Formatter
        </>
      }
      description="Beautify JSON with 2-space, 4-space, or tab indentation — or minify it into a single line for logs and payloads. Optionally sort keys alphabetically for stable diffs."
    >
      {/* Options */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-1">
          <button onClick={() => setMode("pretty")} className={tabClass(mode === "pretty")}>Pretty</button>
          <button onClick={() => setMode("minify")} className={tabClass(mode === "minify")}>Minify (1 line)</button>
        </div>
        {mode === "pretty" && (
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value as "2" | "4" | "tab")}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500/50"
            aria-label="Indentation"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tabs</option>
          </select>
        )}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="accent-indigo-500 w-4 h-4"
          />
          Sort keys alphabetically
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Input JSON</label>
            <span className="text-xs text-slate-500">{input.length.toLocaleString()} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"paste": "your JSON here", "nested": {"ok": true}}'
            className="flex-grow min-h-[450px] w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-y custom-scrollbar"
          />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
          )}
        </div>

        {/* Output Panel */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-indigo-500/30 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <label className="text-lg font-semibold text-slate-200">{mode === "pretty" ? "Formatted" : "Minified"} Output</label>
              {output && <span className="text-xs text-slate-500">{output.length.toLocaleString()} chars</span>}
            </div>
            <CopyButton
              text={output}
              label="Copy Output"
              idleClass="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-400 hover:to-purple-400 shadow-lg"
              copiedClass="bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
            />
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted JSON will appear here..."
            className="flex-grow min-h-[450px] w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-indigo-300 font-mono text-sm focus:outline-none custom-scrollbar resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
