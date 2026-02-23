"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type JsonRow = Record<string, unknown>;

export default function JsonBulkEditor() {
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<JsonRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Bulk Edit State
  const [selectedCol, setSelectedCol] = useState<string>("");
  const [bulkVal, setBulkVal] = useState<string>("");

  const [copied, setCopied] = useState(false);

  // Parse input text
  const handleParse = () => {
    try {
      const parsed = JSON.parse(inputText);
      if (!Array.isArray(parsed)) {
        setError("Input must be a JSON array of objects (e.g. [ { \"id\": 1 } ]).");
        setData([]);
        return;
      }
      
      const allObjects = parsed.every(item => typeof item === "object" && item !== null && !Array.isArray(item));
      if (!allObjects) {
        setError("All elements in the array must be JSON objects.");
        setData([]);
        return;
      }

      setData(parsed);
      setError(null);
      
      // Auto-select first column for bulk edit if available
      const keys = getColumns(parsed);
      if (keys.length > 0 && !selectedCol) {
        setSelectedCol(keys[0]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Invalid JSON format: " + err.message);
      } else {
        setError("Invalid JSON format");
      }
      setData([]);
    }
  };

  // Extract unique keys from all objects to form columns
  const columns = useMemo(() => {
    const keys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [data]);

  // Helper for initial parse
  const getColumns = (parsedData: Record<string, unknown>[]) => {
    const keys = new Set<string>();
    parsedData.forEach(item => {
      Object.keys(item).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }

  // Update a single cell
  const handleCellChange = (rowIndex: number, colKey: string, val: string) => {
    const newData = [...data];
    // Keep it as a string for simplicity in the editor, unless it's a number/boolean natively? 
    // We will treat all inputs as strings for the editor to avoid complex type casting issues during mid-typing,
    // but we can try to JSON parse it so "true" becomes boolean true.
    let parsedVal: unknown = val;
    if (val === "true") parsedVal = true;
    else if (val === "false") parsedVal = false;
    else if (val === "null") parsedVal = null;
    else if (!isNaN(Number(val)) && val.trim() !== "") parsedVal = Number(val);

    newData[rowIndex] = { ...newData[rowIndex], [colKey]: parsedVal };
    setData(newData);
  };

  // Bulk update a whole column
  const handleBulkUpdate = () => {
    if (!selectedCol) return;
    
    let parsedVal: unknown = bulkVal;
    if (bulkVal === "true") parsedVal = true;
    else if (bulkVal === "false") parsedVal = false;
    else if (bulkVal === "null") parsedVal = null;
    else if (!isNaN(Number(bulkVal)) && bulkVal.trim() !== "") parsedVal = Number(bulkVal);

    const newData = data.map(row => ({
      ...row,
      [selectedCol]: parsedVal
    }));
    setData(newData);
    setBulkVal(""); // reset after 
  };

  // Convert a whole column text to single line
  const handleTransformToSingleLine = () => {
    if (!selectedCol) return;

    const newData = data.map(row => {
      const val = row[selectedCol];
      if (typeof val === "string") {
        const converted = val.replace(/\n/g, "\\n").replace(/\r/g, "");
        return { ...row, [selectedCol]: converted };
      }
      return row;
    });
    setData(newData);
  };

  const getOutputText = () => {
    return JSON.stringify(data, null, 2);
  };

  const handleCopy = async () => {
    if (data.length === 0) return;
    try {
      await navigator.clipboard.writeText(getOutputText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 shrink-0">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight shrink-0">
          JSON <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Bulk Editor</span>
        </h1>
        <p className="text-slate-400 mb-8 max-w-3xl text-lg shrink-0">
          Paste a JSON array generated from the Dummy Data Factory (or anywhere else) to view it as a spreadsheet. 
          Individually modify cells or bulk replace entire columns with your real data.
        </p>

        {/* Workspace */}
        <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
          
          {/* Left / Top Sidebar: Input area & Output area */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 shrink-0 h-[800px] lg:h-auto">
            {/* Input Phase */}
            <div className="flex flex-col flex-1 min-h-0 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center shrink-0">
                <label className="text-sm font-semibold text-slate-300">Target JSON Array</label>
                <button 
                  onClick={handleParse}
                  className="px-4 py-1.5 text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Load to Table 👉
                </button>
              </div>
              <textarea
                className="flex-1 w-full p-4 rounded-xl bg-black/50 border border-white/10 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500/50 resize-none custom-scrollbar"
                placeholder="Paste JSON array here...&#10;[&#10;  { &quot;id&quot;: 1, &quot;name&quot;: &quot;foo&quot; }&#10;]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {error && <p className="text-red-400 text-xs mt-1 shrink-0">{error}</p>}
            </div>

            {/* Output Phase */}
            <div className="flex flex-col flex-1 min-h-0 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center shrink-0">
                <label className="text-sm font-semibold text-slate-300">Result JSON</label>
                <button 
                  onClick={handleCopy}
                  disabled={data.length === 0}
                  className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    copied 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : "bg-white/10 text-white hover:bg-white/20 border border-transparent disabled:opacity-50"
                  }`}
                >
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <textarea
                className="flex-1 w-full p-4 rounded-xl bg-black/60 border border-white/5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500/30 resize-none shadow-inner custom-scrollbar"
                placeholder="Edited JSON will appear here..."
                value={data.length > 0 ? getOutputText() : ""}
                readOnly
              />
            </div>
          </div>

          {/* Right / Bottom Area: Spreadsheet & Editor tools */}
          <div className="w-full lg:w-2/3 flex flex-col bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-1 min-h-[500px]">
            {data.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-slate-500 text-sm flex-col gap-4">
                <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Load valid JSON to view and edit spreadsheet
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Bulk Edit Tool Bar */}
                <div className="shrink-0 p-4 border-b border-white/10 flex flex-wrap items-end gap-3 bg-black/20 rounded-t-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Key Column</label>
                    <select
                      value={selectedCol}
                      onChange={(e) => setSelectedCol(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 min-w-[120px]"
                    >
                      {columns.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-grow max-w-sm">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">Override All Cells With</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. true, 123, new value..."
                        value={bulkVal}
                        onChange={(e) => setBulkVal(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                      <button 
                        onClick={handleBulkUpdate}
                        className="px-4 py-1.5 text-sm font-bold bg-blue-500 hover:bg-blue-400 text-black rounded-lg transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      >
                        Apply to All
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow max-w-xs flex items-end">
                     <button 
                        onClick={handleTransformToSingleLine}
                        title="Convert multiline text in this column to single line (\\n)"
                        className="px-4 py-1.5 text-sm font-bold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Convert to Single Line
                      </button>
                  </div>
                </div>

                {/* Spreadsheet Table */}
                <div className="flex-grow bg-black/40 overflow-auto custom-scrollbar rounded-b-xl relative min-h-0">
                  <table className="w-full text-left text-sm text-slate-300 border-collapse">
                    <thead className="text-xs uppercase bg-white/5 text-slate-400 sticky top-0 z-10 shadow-sm backdrop-blur-md">
                      <tr>
                        <th className="px-4 py-3 font-semibold border-b border-r border-white/10 w-12 text-center bg-transparent">#</th>
                        {columns.map(col => (
                          <th key={col} className="px-4 py-3 font-semibold border-b border-r border-white/10 bg-transparent min-w-[150px]">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5 group transition-colors">
                          <td className="px-2 py-2 border-r border-white/5 text-center text-slate-600 text-xs font-mono select-none">
                            {rowIndex + 1}
                          </td>
                          {columns.map(col => {
                            const val = row[col];
                            // display string representation
                            const displayVal = val === null ? "null" : typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
                            
                            return (
                              <td key={col} className="border-r border-white/5 p-0 relative h-full align-top">
                                <textarea
                                  value={displayVal}
                                  onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                                  className="w-full h-full min-h-[44px] px-3 py-2 bg-transparent text-slate-300 focus:bg-blue-900/20 focus:outline-none focus:text-white transition-colors custom-scrollbar resize-y"
                                  rows={1}
                                />
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
