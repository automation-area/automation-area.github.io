"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";

export default function SqlBulkInserter() {
  const [inputText, setInputText] = useState("");
  const [tableName, setTableName] = useState("MyTable");
  const [inputType, setInputType] = useState<"auto" | "json" | "csv">("auto");
  const { formattedOutput, errorLine } = useMemo(() => {
    if (!inputText.trim()) return { formattedOutput: "", errorLine: null };

    let data: Record<string, unknown>[] = [];
    const text = inputText.trim();

    // Determine type if auto
    let actualType = inputType;
    if (actualType === "auto") {
      if (text.startsWith("[") || text.startsWith("{")) {
        actualType = "json";
      } else {
        actualType = "csv";
      }
    }

    try {
      if (actualType === "json") {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          data = parsed;
        } else if (typeof parsed === "object" && parsed !== null) {
          data = [parsed];
        } else {
          return { formattedOutput: "", errorLine: "JSON must be an object or an array of objects." };
        }
      } else if (actualType === "csv") {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
        if (lines.length < 2) {
          return { formattedOutput: "", errorLine: "CSV must have at least a header row and one data row." };
        }

        // Simple CSV parser (doesn't handle commas inside quotes perfectly, but good enough for basic use)
        const parseCsvLine = (line: string) => {
          const result = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
        };

        const headers = parseCsvLine(lines[0]);

        for (let i = 1; i < lines.length; i++) {
          const values = parseCsvLine(lines[i]);
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          data.push(row);
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return { formattedOutput: "", errorLine: `Parsing error: ${e.message}` };
      }
      return { formattedOutput: "", errorLine: `Parsing error` };
    }

    if (data.length === 0) return { formattedOutput: "", errorLine: null };

    // Extract all unique columns
    const columnsSet = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => columnsSet.add(key));
    });
    const columns = Array.from(columnsSet);

    if (columns.length === 0) return { formattedOutput: "", errorLine: null };

    // Generate INSERT statements
    // Try to batch them using multiple VALUES (SQL Server 2008+, MySQL, PostgreSQL)
    // format: INSERT INTO [Table] (col1, col2) VALUES (v1, v2), (v3, v4);

    const formatValue = (val: unknown) => {
      if (val === null || val === undefined || val === '') return "NULL";
      if (typeof val === "number") return val.toString();
      if (typeof val === "boolean") return val ? "1" : "0";

      // String escape
      const escaped = val.toString().replace(/'/g, "''");
      return `N'${escaped}'`;
    };

    const colString = columns.map(c => `[${c}]`).join(", ");

    // Batch every 100 rows to avoid giant single queries that might break limits
    const batchSize = 100;
    const statements = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batchList = data.slice(i, i + batchSize);

      const valuesList = batchList.map(row => {
        const rowVals = columns.map(col => formatValue(row[col]));
        return `  (${rowVals.join(", ")})`;
      });

      const statement = `INSERT INTO [${tableName || 'Table'}]\n  (${colString})\nVALUES\n${valuesList.join(",\n")};`;
      statements.push(statement);
    }

    return { formattedOutput: statements.join("\n\n"), errorLine: null };

  }, [inputText, tableName, inputType]);

  const loadExampleJson = () => {
    setInputType("json");
    setInputText(`[
  { "id": 1, "name": "John Doe", "email": "john@example.com", "isActive": true },
  { "id": 2, "name": "Jane Smith", "email": "jane@example.com", "isActive": false }
]`);
  };

  const loadExampleCsv = () => {
    setInputType("csv");
    setInputText(`id, name, email, isActive
3, "Tom, Hardy", tom@example.com, 1
4, Alice Jones, alice@example.com, 0`);
  };

  return (
    <ToolLayout
      glow="top-0 right-1/4 bg-blue-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SQL Bulk</span> Inserter
        </>
      }
      description={
        <>
          Convert JSON or CSV data into SQL <code className="bg-white/10 px-1 py-0.5 rounded text-sm text-slate-300">INSERT INTO</code> scripts instantly. Perfect for migrating mock data or seeding databases without writing backend code.
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[600px]">
        {/* Input Panel */}
        <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Data Input</label>
            <div className="flex gap-2">
              <button onClick={loadExampleJson} className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors">
                Example JSON
              </button>
              <button onClick={loadExampleCsv} className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors">
                Example CSV
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Target Table Name</label>
              <input
                type="text"
                value={tableName}
                onChange={e => setTableName(e.target.value)}
                placeholder="Users"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Data Type</label>
              <select
                value={inputType}
                onChange={e => setInputType(e.target.value as "auto" | "json" | "csv")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="auto">Auto Detect</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste JSON array or CSV text here..."
            className="flex-grow w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-y custom-scrollbar min-h-[300px]"
          />
          {errorLine && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {errorLine}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg group hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Generated SQL Script</label>
            <CopyButton
              text={formattedOutput}
              label="Copy Script"
              idleClass="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-400 hover:to-blue-400 shadow-lg"
              copiedClass="bg-blue-500/20 text-blue-400 border border-blue-500/50"
            />
          </div>
          <textarea
            readOnly
            value={formattedOutput}
            placeholder="INSERT INTO [MyTable] ..."
            className="flex-grow w-full bg-black/80 border border-white/5 rounded-xl px-4 py-3 text-cyan-400 font-mono text-sm focus:outline-none custom-scrollbar resize-none min-h-[300px]"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
