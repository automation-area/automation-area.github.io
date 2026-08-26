"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

export default function TextToSingleLine() {
  const [input, setInput] = useState("");

  // Convert newlines to literal \n
  const output = input.replace(/\n/g, "\\n").replace(/\r/g, "");

  return (
    <ToolLayout
      glow="top-0 right-0 bg-indigo-500/10"
      heading={
        <>
          Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Single Line</span>
        </>
      }
      description={
        <>
          Convert multiline text blocks into a single string with <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">\n</code> escape characters.
          Perfect for embedding multi-line prompts, JSON fields, or environment variables.
        </>
      }
    >
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
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-slate-300">Converted Output</label>
            <CopyButton text={output} label="Copy Output" />
          </div>
          <textarea
            className="w-full h-[500px] p-5 rounded-xl bg-black/60 border border-white/5 text-emerald-400 font-mono text-sm leading-relaxed focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-inner"
            placeholder="Escaped output will appear here..."
            value={output}
            readOnly
          />
        </div>
      </div>
    </ToolLayout>
  );
}
