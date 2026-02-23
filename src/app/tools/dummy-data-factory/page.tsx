"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldType = "firstName" | "lastName" | "fullName" | "email" | "phone" | "address" | "company" | "jobTitle" | "date" | "uuid" | "number" | "boolean";

interface Field {
  id: string;
  name: string;
  type: FieldType;
}

const FIRST_NAMES = ["Oliver", "Emma", "Liam", "Olivia", "Noah", "Ava", "Elijah", "Sophia", "William", "Isabella", "James", "Mia", "Benjamin", "Amelia", "Lucas"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez"];
const DOMAINS = ["example.com", "test.net", "demo.org", "mail.com", "placeholder.co"];
const STREETS = ["Main St", "High St", "Pearl St", "Maple Dr", "Oak Ln", "Cedar Ct", "Pine Blvd", "Elm Ave", "Washington Way"];
const COMPANIES = ["Acme Corp", "Globex", "Initech", "Soylent Corp", "Stark Industries", "Wayne Enterprises", "Umbrella Corp", "Cyberdyne Systems"];
const JOB_TITLES = ["Software Engineer", "Product Manager", "Designer", "Data Analyst", "Marketing Specialist", "Sales Representative", "HR Manager", "CEO"];

const generateRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateData = (type: FieldType): string | number | boolean => {
  switch (type) {
    case "firstName":
      return pickRandom(FIRST_NAMES);
    case "lastName":
      return pickRandom(LAST_NAMES);
    case "fullName":
      return `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`;
    case "email":
      return `${pickRandom(FIRST_NAMES).toLowerCase()}.${pickRandom(LAST_NAMES).toLowerCase()}@${pickRandom(DOMAINS)}`;
    case "phone":
      return `+1 ${generateRandomInt(200, 999)}-${generateRandomInt(200, 999)}-${generateRandomInt(1000, 9999)}`;
    case "address":
      return `${generateRandomInt(1, 9999)} ${pickRandom(STREETS)}, Cityville, ${generateRandomInt(10000, 99999)}`;
    case "company":
      return pickRandom(COMPANIES);
    case "jobTitle":
      return pickRandom(JOB_TITLES);
    case "date":
      const date = new Date(Date.now() - generateRandomInt(0, 31536000000)); // Within last year
      return date.toISOString().split("T")[0];
    case "uuid":
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    case "number":
      return generateRandomInt(1, 1000);
    case "boolean":
      return Math.random() >= 0.5;
    default:
      return "Unknown";
  }
};

export default function DummyDataFactory() {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([
    { id: "1", name: "id", type: "uuid" },
    { id: "2", name: "name", type: "fullName" },
    { id: "3", name: "email", type: "email" },
  ]);
  const [rowCount, setRowCount] = useState<number>(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const addField = () => {
    setFields([...fields, { id: Date.now().toString(), name: `field${fields.length + 1}`, type: "firstName" }]);
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleGenerate = () => {
    const data: Record<string, string | number | boolean>[] = [];
    const actualCount = Math.min(Math.max(1, rowCount), 1000); // max 1000 rows

    for (let i = 0; i < actualCount; i++) {
      const row: Record<string, string | number | boolean> = {};
      fields.forEach(f => {
        if (f.name.trim() !== "") {
          row[f.name] = generateData(f.type);
        }
      });
      data.push(row);
    }

    if (format === "json") {
      setOutput(JSON.stringify(data, null, 2));
    } else {
      if (data.length === 0) return setOutput("");
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(","),
        ...data.map(row => headers.map(header => {
          const val = row[header];
          return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
        }).join(","))
      ];
      setOutput(csvRows.join("\n"));
    }
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

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dummy-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jumpToBulkEditor = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error("Failed to copy text before jump", err);
    }
    router.push("/tools/json-bulk-editor");
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
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
          Dummy Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Factory</span>
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">
          Generate realistic-looking mock data for testing, prototyping, or populating databases. 
          Everything runs locally in your browser, enabling fast export to JSON or CSV without server limits.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panes */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Schema Definition</h2>
                <button 
                  onClick={addField}
                  className="px-3 py-1.5 text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Field
                </button>
              </div>

              <div className="space-y-3 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex gap-3 items-start p-3 bg-black/40 border border-white/5 rounded-xl group/field">
                    <div className="flex-grow space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                      <input 
                        type="text" 
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="Field Name"
                        className="w-full sm:w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                        className="w-full sm:w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                      >
                        <option value="uuid" className="bg-slate-900">UUID / ID</option>
                        <option value="fullName" className="bg-slate-900">Full Name</option>
                        <option value="firstName" className="bg-slate-900">First Name</option>
                        <option value="lastName" className="bg-slate-900">Last Name</option>
                        <option value="email" className="bg-slate-900">Email Address</option>
                        <option value="phone" className="bg-slate-900">Phone Number</option>
                        <option value="address" className="bg-slate-900">Street Address</option>
                        <option value="company" className="bg-slate-900">Company Name</option>
                        <option value="jobTitle" className="bg-slate-900">Job Title</option>
                        <option value="date" className="bg-slate-900">Random Date</option>
                        <option value="number" className="bg-slate-900">Random Number</option>
                        <option value="boolean" className="bg-slate-900">Boolean (True/False)</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => removeField(field.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-0.5"
                      title="Remove Field"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">No fields defined. Add a field to start.</div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Rows to Generate</label>
                <input 
                  type="number" 
                  min="1" 
                  max="1000" 
                  value={rowCount}
                  onChange={(e) => setRowCount(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Export Format</label>
                <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-1">
                  <button 
                    onClick={() => setFormat("json")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${format === "json" ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    JSON
                  </button>
                  <button 
                    onClick={() => setFormat("csv")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${format === "csv" ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    CSV
                  </button>
                </div>
              </div>
              <div className="w-full mt-2">
                <button 
                  onClick={handleGenerate}
                  disabled={fields.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Generate Data
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-3 min-h-[500px]">
            <div className="flex justify-between items-center bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
              <span className="text-sm font-medium text-slate-300">Generated Output</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`text-sm flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors ${
                    copied 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                      : "bg-white/10 text-white border border-transparent hover:bg-white/20 disabled:opacity-50"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={downloadFile}
                  disabled={!output}
                  className="text-sm flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                >
                  Download {format.toUpperCase()}
                </button>
                {format === "json" && output && (
                  <button 
                    onClick={jumpToBulkEditor}
                    className="text-sm flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                  >
                    Auto-Copy & Open in Bulk Editor
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <textarea
              className="flex-grow w-full p-5 rounded-2xl bg-black/60 border border-white/5 text-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500/30 transition-all resize-none shadow-inner custom-scrollbar"
              placeholder="Configure fields and generate data to see output here..."
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
