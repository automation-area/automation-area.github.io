"use client";

import { useState } from "react";
import Link from "next/link";

export default function TextToSingleLine() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (text: string) => {
    setInput(text);
    // Convert newlines to literal \n
    const converted = text.replace(/\n/g, "\\n").replace(/\r/g, "");
    setOutput(converted);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

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
          Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Single Line</span>
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">
          Convert multiline text blocks into a single string with <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">\n</code> escape characters. 
          Perfect for embedding multi-line prompts, JSON fields, or environment variables.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Input Area */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-300 ml-1">Input Text</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <textarea
                className="relative w-full h-[500px] p-5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-2xl font-mono text-sm leading-relaxed"
                placeholder="Paste your multiline text here...&#10;e.g.&#10;Line 1&#10;Line 2&#10;Line 3"
                value={input}
                onChange={(e) => handleConvert(e.target.value)}
              />
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-300">Converted Output</label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  copied 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                    : output 
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-lg" 
                      : "bg-white/5 text-slate-600 border border-transparent cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Output
                  </>
                )}
              </button>
            </div>
            <textarea
              className="w-full h-[500px] p-5 rounded-xl bg-black/60 border border-white/5 text-emerald-400 font-mono text-sm leading-relaxed focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-inner"
              placeholder="Escaped output will appear here..."
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
