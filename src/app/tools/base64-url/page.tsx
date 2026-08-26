"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

type Codec = "base64" | "url";
type Mode = "encode" | "decode";

function base64Encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function base64Decode(s: string): string {
  const bin = atob(s.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Url() {
  const [codec, setCodec] = useState<Codec>("base64");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    try {
      if (codec === "base64") {
        return { output: mode === "encode" ? base64Encode(input) : base64Decode(input), error: null };
      }
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input.trim()),
        error: null,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to convert";
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} error: ${msg}` };
    }
  }, [codec, mode, input]);

  const tabClass = (active: boolean) =>
    `flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
      active ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <ToolLayout
      glow="top-0 right-0 bg-sky-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Base64 / URL</span> Encoder
        </>
      }
      description="Encode and decode Base64 (UTF-8 safe, so Korean and emoji survive) and URL-encoded strings. Everything runs locally in your browser."
    >
      {/* Codec & mode selectors */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-1 min-w-[220px]">
          <button onClick={() => setCodec("base64")} className={tabClass(codec === "base64")}>Base64</button>
          <button onClick={() => setCodec("url")} className={tabClass(codec === "url")}>URL</button>
        </div>
        <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-1 min-w-[220px]">
          <button onClick={() => setMode("encode")} className={tabClass(mode === "encode")}>Encode</button>
          <button onClick={() => setMode("decode")} className={tabClass(mode === "decode")}>Decode</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">
              {mode === "encode" ? "Plain Text" : codec === "base64" ? "Base64 Input" : "Encoded URL"}
            </label>
            <span className="text-xs text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type or paste text to encode..."
                : codec === "base64"
                  ? "SGVsbG8gV29ybGQh"
                  : "Hello%20World%21"
            }
            className="flex-grow min-h-[350px] w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-sky-500/50 transition-colors resize-y custom-scrollbar"
          />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
          )}
        </div>

        {/* Output Panel */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-sky-500/30 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">
              {mode === "encode" ? (codec === "base64" ? "Base64 Output" : "Encoded URL") : "Decoded Text"}
            </label>
            <CopyButton
              text={output}
              label="Copy Output"
              idleClass="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium hover:from-sky-400 hover:to-blue-400 shadow-lg"
              copiedClass="bg-sky-500/20 text-sky-400 border border-sky-500/50"
            />
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className="flex-grow min-h-[350px] w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-sky-300 font-mono text-sm focus:outline-none custom-scrollbar resize-none break-all"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
