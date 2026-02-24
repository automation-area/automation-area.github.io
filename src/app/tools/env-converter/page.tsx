"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import yaml from "js-yaml";

type Format = "env" | "json" | "yaml";

export default function EnvConverter() {
  const [inputText, setInputText] = useState("");
  const { outputText, errorLine } = useMemo(() => {
    if (!inputText.trim()) {
      return { outputText: "", errorLine: null };
    }

    try {
      let parsedObj: Record<string, unknown> = {};

      // Helper to parse .env into nested object
      const parseEnv = (text: string) => {
        const lines = text.split(/\r?\n/);
        const obj: Record<string, unknown> = {};
        
        for (const line of lines) {
          if (!line.trim() || line.trim().startsWith("#")) continue;
          
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            
            // Remove quotes if present
            if (/^['"].*['"]$/.test(val)) {
              val = val.slice(1, -1);
            }
            
            const keyParts = key.split('_');
            
            let current = obj;
            for (let i = 0; i < keyParts.length - 1; i++) {
              const part = keyParts[i];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (!current[part]) current[part] = {} as any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              current = current[part] as any;
            }
            
            let parsedVal: unknown = val;
            if (val.toLowerCase() === 'true') parsedVal = true;
            else if (val.toLowerCase() === 'false') parsedVal = false;
            else if (!isNaN(Number(val)) && val !== '') parsedVal = Number(val);
            
            current[keyParts[keyParts.length - 1]] = parsedVal;
          }
        }
        return obj;
      };

      // Helper to flatten JSON into .env lines
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flattenObject = (obj: any, prefix = ""): string[] => {
        let lines: string[] = [];
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            lines = lines.concat(flattenObject(obj[key], `${prefix}${key}_`));
          } else {
            let val = obj[key];
            if (typeof val === 'string' && (val.includes(' ') || val.includes('#') || val.includes('='))) {
              val = `"${val}"`;
            }
            lines.push(`${prefix}${key}=${val}`);
          }
        }
        return lines;
      };

      // Parse Input
      if (inputFormat === "env") {
        parsedObj = parseEnv(inputText);
      } else if (inputFormat === "json") {
        parsedObj = JSON.parse(inputText);
      } else if (inputFormat === "yaml") {
        parsedObj = yaml.load(inputText) as Record<string, unknown>;
      }

      // Stringify Output
      let out = "";
      if (outputFormat === "env") {
        const envLines = flattenObject(parsedObj);
        out = envLines.map(l => l.toUpperCase()).join("\n");
      } else if (outputFormat === "json") {
        out = JSON.stringify(parsedObj, null, 2);
      } else if (outputFormat === "yaml") {
        out = yaml.dump(parsedObj);
      }
      
      return { outputText: out, errorLine: null };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return { outputText: "", errorLine: `Parsing Error: ${e.message}` };
      }
      return { outputText: "", errorLine: `Parsing Error` };
    }
  }, [inputText, inputFormat, outputFormat]);

  const copyToClipboard = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const loadExample = () => {
    setInputFormat("env");
    setOutputFormat("json");
    setInputText(`APP_PORT=3000
APP_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD="super secret password!"
FEATURES_NEW_UI=true
FEATURES_BETA=false`);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">Config</span> Converter
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">
          Convert configurations seamlessly between <code className="bg-white/10 px-1 py-0.5 rounded">.env</code>, <code className="bg-white/10 px-1 py-0.5 rounded">JSON</code>, and <code className="bg-white/10 px-1 py-0.5 rounded">YAML</code> formats. It automatically handles nesting logic like <code className="text-fuchsia-300">DB_HOST</code> &rarr; <code className="text-fuchsia-300">{"{ DB: { HOST: ... } }"}</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[600px]">
          {/* Input Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <select 
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value as Format)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-fuchsia-500/50"
                  aria-label="Input Format"
                >
                  <option value="env">.env Form</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
              <button 
                onClick={loadExample} 
                className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors"
                aria-label="Load Example"
              >
                Load Example
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your configuration here..."
              className="flex-grow w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-y custom-scrollbar min-h-[300px]"
              aria-label="Input Configuration"
            />
            {errorLine && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errorLine}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-fuchsia-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <select 
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as Format)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-fuchsia-500/50"
                  aria-label="Output Format"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="env">.env Form</option>
                </select>
              </div>
              <button
                onClick={copyToClipboard}
                disabled={!outputText}
                className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
                  outputText
                    ? copied 
                      ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50" 
                      : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium hover:from-purple-400 hover:to-fuchsia-400"
                    : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
                aria-label="Copy Configuration"
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
              value={outputText}
              placeholder="Output will appear here..."
              className="flex-grow w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-fuchsia-400 font-mono text-sm focus:outline-none custom-scrollbar resize-none min-h-[300px]"
              aria-label="Output Configuration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
