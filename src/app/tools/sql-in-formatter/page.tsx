"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function SqlInFormatter() {
  const [inputText, setInputText] = useState("");
  const [quoteItems, setQuoteItems] = useState(true);
  const [wrapInParentheses, setWrapInParentheses] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  
  const [copied, setCopied] = useState(false);

  const formattedOutput = useMemo(() => {
    let lines = inputText.split(/\r?\n/);
    
    if (removeEmpty) {
      lines = lines.map(l => l.trim()).filter(l => l.length > 0);
    } else {
      lines = lines.map(l => l.trim());
    }

    if (removeDuplicates) {
      lines = Array.from(new Set(lines));
    }

    if (lines.length === 0) return "";

    const formattedLines = lines.map(line => {
      if (quoteItems) {
        // Escape single quotes by doubling them (SQL standard)
        const escaped = line.replace(/'/g, "''");
        return `'${escaped}'`;
      }
      return line;
    });

    const joined = formattedLines.join(", ");
    
    if (wrapInParentheses) {
      return `(${joined})`;
    }
    
    return joined;
  }, [inputText, quoteItems, wrapInParentheses, removeEmpty, removeDuplicates]);

  const copyToClipboard = async () => {
    if (!formattedOutput) return;
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">SQL IN Clause</span> Formatter
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">
          Paste a list of data from Excel or text files to instantly format it for use in SQL WHERE IN (...) queries. Very useful for querying large data sets without manual formatting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          {/* Input Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-slate-200">Input Data (Newline Separated)</label>
              <span className="text-xs text-slate-500">{inputText.split(/\r?\n/).filter(l => l.trim().length > 0).length} items</span>
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
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={quoteItems} onChange={(e) => setQuoteItems(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded border border-slate-500 peer-checked:border-orange-500 peer-checked:bg-orange-500/20 transition-all"></div>
                  <svg className="w-3.5 h-3.5 text-orange-500 absolute scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Wrap with Quotes (&apos;item&apos;)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={wrapInParentheses} onChange={(e) => setWrapInParentheses(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded border border-slate-500 peer-checked:border-orange-500 peer-checked:bg-orange-500/20 transition-all"></div>
                  <svg className="w-3.5 h-3.5 text-orange-500 absolute scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Wrap with Parentheses (...)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={removeDuplicates} onChange={(e) => setRemoveDuplicates(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded border border-slate-500 peer-checked:border-orange-500 peer-checked:bg-orange-500/20 transition-all"></div>
                  <svg className="w-3.5 h-3.5 text-orange-500 absolute scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Remove Duplicates</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 rounded border border-slate-500 peer-checked:border-orange-500 peer-checked:bg-orange-500/20 transition-all"></div>
                  <svg className="w-3.5 h-3.5 text-orange-500 absolute scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Ignore Empty Lines</span>
              </label>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-orange-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-slate-200">Formatted Output</label>
              <button
                onClick={copyToClipboard}
                disabled={!formattedOutput}
                className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
                  formattedOutput 
                    ? copied 
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/50" 
                      : "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-400 hover:to-orange-400"
                    : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
              >
                {copied ? (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Output</>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={formattedOutput}
              placeholder="('id_001', 'id_002', 'id_003')"
              className="flex-grow min-h-[300px] w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:outline-none custom-scrollbar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
