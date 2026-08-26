"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

export default function SqlParameterBinder() {
  const [inputText, setInputText] = useState("");

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

    // --- sp_executesql Parsing ---
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

  return (
    <ToolLayout
      glow="top-0 right-1/4 bg-amber-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">SQL Parameter</span> Binder
        </>
      }
      description={
        <>
          Paste an MS SQL Profiler log or EF Core log containing <code className="bg-white/10 px-1 py-0.5 rounded">sp_executesql</code>. It will automatically bind parameters to the statement and generate a raw SQL query you can run directly in SSMS.
        </>
      }
    >
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
            <CopyButton
              text={formattedOutput === inputText ? "" : formattedOutput}
              label="Copy Query"
              idleClass="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium hover:from-amber-400 hover:to-yellow-400 shadow-lg"
              copiedClass="bg-amber-500/20 text-amber-400 border border-amber-500/50"
            />
          </div>
          <textarea
            readOnly
            value={formattedOutput}
            placeholder="SELECT * FROM Users WHERE Id = 123"
            className="flex-grow w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-amber-400 font-mono text-sm focus:outline-none custom-scrollbar resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
