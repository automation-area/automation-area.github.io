"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function SqlParameterBinder() {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  const formattedOutput = useMemo(() => {
    if (!inputText.trim()) return "";

    const text = inputText;

    // --- EF Core Log Parsing (Executed DbCommand) ---
    if (text.includes('Executed DbCommand') || text.includes('CommandType=')) {
      // 1. Extract command parameters string
      // Example: Executed DbCommand (560ms) [Parameters=[@__name_0_startswith='?' (Size = 100), @p1=1], CommandType='Text', ...]
      const paramsMatch = text.match(/Parameters=\[([^\]]*)\]/i);
      
      // 2. Extract the actual query part
      // The query usually comes after the header block, starting on a newline
      // e.g., "\n      SELECT ..."
      const queryMatch = text.match(/\]\s*\n\s*([\s\S]+)$/i) || text.match(/CommandTimeout='\d+'\]\s*([\s\S]+)$/i);
      
      if (paramsMatch && queryMatch) {
         const paramStr = paramsMatch[1];
         let query = queryMatch[1].trim();
         
         // Parse parameters like: @__name_0_startswith='?' (Size = 100), @p1=1
         // Note: Values in EF logs might be truncated or have types shown, we'll extract the best we can.
         // Pattern: @paramName='value' or @paramName=value
         const paramValueRegex = /(@\w+)=('[^']*'|[^, (]+)/g;
         const params: Record<string, string> = {};
         
         let m;
         while ((m = paramValueRegex.exec(paramStr)) !== null) {
            params[m[1]] = m[2];
         }
         
         const paramNames = Object.keys(params).sort((a, b) => b.length - a.length);
         for (const pName of paramNames) {
            const regex = new RegExp(pName + '\\b', 'g');
            query = query.replace(regex, params[pName]);
         }
         
         return query;
      }
    }

    // --- sp_executesql Parsig ---
    if (text.toLowerCase().includes('sp_executesql')) {
      const statementRegex = /sp_executesql\s+N?'((?:[^']|'')*)'/i;
      const statementMatch = text.match(statementRegex);
      
      if (statementMatch) {
        let query = statementMatch[1].replace(/''/g, "'");
        
        const paramDeclRegex = /sp_executesql\s+N?'(?:[^']|'')*'\s*,\s*N?'((?:[^']|'')*)'/i;
        const paramDeclMatch = text.match(paramDeclRegex);
        
        let valuesString = text;
        if (paramDeclMatch) {
          const declIndex = text.indexOf(paramDeclMatch[0]);
          valuesString = text.substring(declIndex + paramDeclMatch[0].length);
        } else {
          const stmtIndex = text.indexOf(statementMatch[0]);
          valuesString = text.substring(stmtIndex + statementMatch[0].length);
        }
        
        const paramValueRegex = /@(\w+)\s*=\s*(N?'(?:[^']|'')*'|[^,]+)/g;
        
        const params: Record<string, string> = {};
        let match;
        while ((match = paramValueRegex.exec(valuesString)) !== null) {
           const paramName = '@' + match[1];
           const paramValue = match[2].trim();
           params[paramName] = paramValue;
        }
        
        const paramNames = Object.keys(params).sort((a, b) => b.length - a.length);
        
        for (const pName of paramNames) {
           const regex = new RegExp(pName + '\\b', 'g');
           query = query.replace(regex, params[pName]);
        }
        
        return query.trim();
      }
    }

    return text;
  }, [inputText]);

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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">SQL Parameter</span> Binder
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">
          Paste an MS SQL Profiler log or EF Core log containing <code className="bg-white/10 px-1 py-0.5 rounded">sp_executesql</code>. It will automatically bind parameters to the statement and generate a raw SQL query you can run directly in SSMS.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
          {/* Input Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-slate-200">Profiler Log Input</label>
              <button
                onClick={() => setInputText("exec sp_executesql N'SELECT * FROM Users WHERE Id = @p1 AND Status = @p2',N'@p1 int,@p2 nvarchar(20)',@p1=123,@p2=N'Active'")}
                className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors"
              >
                Load Example
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="exec sp_executesql N'SELECT * FROM Users WHERE Id = @p1', N'@p1 int', @p1=123"
              className="flex-grow w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none custom-scrollbar"
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold text-slate-200">Raw SQL Query</label>
              <button
                onClick={copyToClipboard}
                disabled={!formattedOutput || formattedOutput === inputText}
                className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
                  formattedOutput && formattedOutput !== inputText
                    ? copied 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                      : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium hover:from-amber-400 hover:to-yellow-400"
                    : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
              >
                {copied ? (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Query</>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={formattedOutput}
              placeholder="SELECT * FROM Users WHERE Id = 123"
              className="flex-grow w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-amber-400 font-mono text-sm focus:outline-none custom-scrollbar resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
