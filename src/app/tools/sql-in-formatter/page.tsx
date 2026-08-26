"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

export default function SqlInFormatter() {
  const [inputText, setInputText] = useState("");
  const [quoteItems, setQuoteItems] = useState(true);
  const [wrapInParentheses, setWrapInParentheses] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  const formattedOutput = useMemo(() => {
    let lines = inputText.split(/\r?\n/).map((l) => l.trim());

    if (removeEmpty) {
      lines = lines.filter((l) => l.length > 0);
    }

    if (removeDuplicates) {
      lines = Array.from(new Set(lines));
    }

    if (lines.length === 0) return "";

    const formattedLines = lines.map((line) => {
      if (quoteItems) {
        // Escape single quotes by doubling them (SQL standard)
        return `'${line.replace(/'/g, "''")}'`;
      }
      return line;
    });

    const joined = formattedLines.join(", ");
    return wrapInParentheses ? `(${joined})` : joined;
  }, [inputText, quoteItems, wrapInParentheses, removeEmpty, removeDuplicates]);

  const options: { label: string; checked: boolean; onChange: (v: boolean) => void }[] = [
    { label: "Wrap with Quotes ('item')", checked: quoteItems, onChange: setQuoteItems },
    { label: "Wrap with Parentheses (...)", checked: wrapInParentheses, onChange: setWrapInParentheses },
    { label: "Remove Duplicates", checked: removeDuplicates, onChange: setRemoveDuplicates },
    { label: "Ignore Empty Lines", checked: removeEmpty, onChange: setRemoveEmpty },
  ];

  return (
    <ToolLayout
      glow="top-0 right-0 bg-rose-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">SQL IN Clause</span> Formatter
        </>
      }
      description="Paste a list of data from Excel or text files to instantly format it for use in SQL WHERE IN (...) queries. Very useful for querying large data sets without manual formatting."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        {/* Input Panel */}
        <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Input Data (Newline Separated)</label>
            <span className="text-xs text-slate-500">
              {inputText.split(/\r?\n/).filter((l) => l.trim().length > 0).length} items
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="id_001&#10;id_002&#10;id_003"
            className="flex-grow min-h-[300px] w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-rose-500/50 transition-colors resize-y custom-scrollbar"
          />

          {/* Options */}
          <div className="mt-6 space-y-3 p-4 bg-black/30 rounded-xl border border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Formatting Options</h3>
            {options.map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => opt.onChange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded border border-slate-500 peer-checked:border-orange-500 peer-checked:bg-orange-500/20 transition-all"></div>
                  <svg
                    className="w-3.5 h-3.5 text-orange-500 absolute scale-0 peer-checked:scale-100 transition-transform pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-orange-500/30 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Formatted Output</label>
            <CopyButton
              text={formattedOutput}
              label="Copy Output"
              idleClass="bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-400 hover:to-orange-400 shadow-lg"
              copiedClass="bg-orange-500/20 text-orange-400 border border-orange-500/50"
            />
          </div>
          <textarea
            readOnly
            value={formattedOutput}
            placeholder="('id_001', 'id_002', 'id_003')"
            className="flex-grow min-h-[300px] w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:outline-none custom-scrollbar"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
