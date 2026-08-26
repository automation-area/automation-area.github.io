"use client";

import { useState, useEffect, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";
import { KST_OFFSET, formatInZone, relativeTime } from "@/lib/time";

const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW_NAMES: Record<string, number> = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
const MONTH_NAMES: Record<string, number> = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

interface CronSchedule {
  minutes: number[];
  hours: number[];
  doms: number[];
  months: number[];
  dows: number[];
  domStar: boolean;
  dowStar: boolean;
  raw: string[];
}

function substituteNames(field: string, map: Record<string, number>): string {
  return field.replace(/[A-Za-z]{3}/g, (w) => {
    const v = map[w.toUpperCase()];
    return v === undefined ? w : String(v);
  });
}

function parseField(field: string, min: number, max: number): number[] | null {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    const m = part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
    if (!m) return null;
    const step = m[2] ? parseInt(m[2], 10) : 1;
    if (step < 1) return null;
    let start = min;
    let end = max;
    if (m[1] !== "*") {
      const [a, b] = m[1].split("-").map(Number);
      start = a;
      // "5/10" means "starting at 5, every 10"; a bare "5" means just 5
      end = b !== undefined ? b : m[2] ? max : a;
      if (start < min || end > max || start > end) return null;
    }
    for (let v = start; v <= end; v += step) values.add(v);
  }
  return Array.from(values).sort((x, y) => x - y);
}

function parseCron(expr: string): CronSchedule | null {
  const raw = expr.trim().split(/\s+/);
  if (raw.length !== 5) return null;

  const minutes = parseField(raw[0], 0, 59);
  const hours = parseField(raw[1], 0, 23);
  const doms = parseField(raw[2], 1, 31);
  const months = parseField(substituteNames(raw[3], MONTH_NAMES), 1, 12);
  const dowsRaw = parseField(substituteNames(raw[4], DOW_NAMES), 0, 7);
  if (!minutes || !hours || !doms || !months || !dowsRaw) return null;

  // 7 is an alias for Sunday (0)
  const dows = Array.from(new Set(dowsRaw.map((d) => d % 7))).sort((a, b) => a - b);

  return {
    minutes,
    hours,
    doms,
    months,
    dows,
    domStar: raw[2] === "*",
    dowStar: raw[4] === "*",
    raw,
  };
}

// Next run times as real epoch ms; the cron fields are evaluated as
// wall-clock time in the timezone given by offsetMs.
function nextRuns(s: CronSchedule, offsetMs: number, count: number, fromMs: number): number[] {
  const runs: number[] = [];
  let cur = (Math.floor(fromMs / 60000) + 1) * 60000 + offsetMs;
  for (let guard = 0; guard < 100000 && runs.length < count; guard++) {
    const d = new Date(cur);
    if (!s.months.includes(d.getUTCMonth() + 1)) {
      cur = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
      continue;
    }
    const domOk = s.doms.includes(d.getUTCDate());
    const dowOk = s.dows.includes(d.getUTCDay());
    // Standard cron: if both day fields are restricted, either may match
    const dayOk = s.domStar ? dowOk : s.dowStar ? domOk : domOk || dowOk;
    if (!dayOk) {
      cur = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
      continue;
    }
    if (!s.hours.includes(d.getUTCHours())) {
      cur = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours() + 1);
      continue;
    }
    if (!s.minutes.includes(d.getUTCMinutes())) {
      cur += 60000;
      continue;
    }
    runs.push(cur - offsetMs);
    cur += 60000;
  }
  return runs;
}

function describeCron(s: CronSchedule): string {
  const [mR, hR] = s.raw;
  const pad = (n: number) => String(n).padStart(2, "0");

  let time: string;
  if (/^\d+$/.test(mR) && /^\d+$/.test(hR)) {
    time = `at ${pad(s.hours[0])}:${pad(s.minutes[0])}`;
    if (s.hours.length > 1 || s.minutes.length > 1) {
      time = `at minute ${s.minutes.join(", ")} past hour ${s.hours.join(", ")}`;
    }
  } else if (mR === "*" && hR === "*") {
    time = "every minute";
  } else if (/^\*\/\d+$/.test(mR) && hR === "*") {
    time = `every ${mR.slice(2)} minutes`;
  } else {
    const mDesc = mR === "*" ? "every minute" : /^\*\/\d+$/.test(mR) ? `every ${mR.slice(2)} minutes` : `at minute ${s.minutes.join(", ")}`;
    const hDesc = hR === "*" ? "" : /^\*\/\d+$/.test(hR) ? ` past every ${hR.slice(2)} hours` : ` past hour ${s.hours.join(", ")}`;
    time = mDesc + hDesc;
  }

  const parts = [time];
  if (!s.domStar) parts.push(`on day ${s.doms.join(", ")} of the month`);
  if (!s.dowStar) parts.push(`${s.domStar ? "on" : "and on"} ${s.dows.map((d) => DAY_FULL[d]).join(", ")}`);
  if (s.raw[3] !== "*") parts.push(`in ${s.months.map((m) => MONTH_FULL[m - 1]).join(", ")}`);

  const sentence = parts.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

const FIELD_LABELS = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];

type Preset = "every-minute" | "every-n-minutes" | "hourly" | "daily" | "weekly" | "monthly";

export default function CronParser() {
  const [expr, setExpr] = useState("");
  const [tz, setTz] = useState<"utc" | "kst">("utc");
  const [now, setNow] = useState(0);

  // Clock state so next-run times refresh and render stays pure
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Builder state
  const [preset, setPreset] = useState<Preset>("daily");
  const [everyN, setEveryN] = useState(15);
  const [time, setTime] = useState("09:00");
  const [dow, setDow] = useState(1);
  const [dom, setDom] = useState(1);

  const builtExpr = useMemo(() => {
    const [h, m] = (time || "00:00").split(":").map(Number);
    const n = Math.min(Math.max(everyN, 1), 59);
    switch (preset) {
      case "every-minute": return "* * * * *";
      case "every-n-minutes": return `*/${n} * * * *`;
      case "hourly": return `${m} * * * *`;
      case "daily": return `${m} ${h} * * *`;
      case "weekly": return `${m} ${h} * * ${dow}`;
      case "monthly": return `${m} ${h} ${dom} * *`;
    }
  }, [preset, everyN, time, dow, dom]);

  const result = useMemo(() => {
    if (!expr.trim() || !now) return null;
    const sched = parseCron(expr);
    if (!sched) return { error: "Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week" };
    const offsetMs = tz === "kst" ? KST_OFFSET : 0;
    const runs = nextRuns(sched, offsetMs, 5, now);
    return { sched, runs, description: describeCron(sched), now, error: null };
  }, [expr, tz, now]);

  const fieldValues = (values: number[]) =>
    values.length > 12 ? `${values.slice(0, 12).join(", ")}, …` : values.join(", ");

  const selectClass = "bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50";

  return (
    <ToolLayout
      glow="top-0 right-0 bg-violet-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Cron Expression</span> Parser
        </>
      }
      description="Parse and explain 5-field cron expressions, or build one from presets. Next run times are shown in both KST and UTC, so a server-side (UTC) schedule is easy to read in Korean time."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expression input */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-slate-200">Cron Expression</label>
            <button
              onClick={() => setExpr("*/15 9-18 * * 1-5")}
              className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors"
            >
              Load Example
            </button>
          </div>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0 9 * * 1-5"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-violet-300 font-mono text-lg tracking-widest focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm text-slate-400">Cron runs in:</label>
            <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-1">
              {(["utc", "kst"] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setTz(z)}
                  className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${tz === z ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {z.toUpperCase()}{z === "utc" ? " (server)" : ""}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Format: <code className="bg-white/10 px-1 py-0.5 rounded">minute hour day-of-month month day-of-week</code> — supports <code className="bg-white/10 px-1 py-0.5 rounded">*</code>, <code className="bg-white/10 px-1 py-0.5 rounded">*/n</code>, <code className="bg-white/10 px-1 py-0.5 rounded">a-b</code>, <code className="bg-white/10 px-1 py-0.5 rounded">a,b,c</code>, and MON/JAN names
          </p>
          {result?.error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{result.error}</div>
          )}
        </div>

        {/* Builder */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <label className="text-lg font-semibold text-slate-200 block mb-4">Cron Builder</label>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Schedule</label>
              <select value={preset} onChange={(e) => setPreset(e.target.value as Preset)} className={selectClass}>
                <option value="every-minute">Every minute</option>
                <option value="every-n-minutes">Every N minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {preset === "every-n-minutes" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">N (minutes)</label>
                <input type="number" min="1" max="59" value={everyN} onChange={(e) => setEveryN(Number(e.target.value))} className={`${selectClass} w-24`} />
              </div>
            )}
            {preset === "weekly" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Day of Week</label>
                <select value={dow} onChange={(e) => setDow(Number(e.target.value))} className={selectClass}>
                  {DAY_FULL.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
            )}
            {preset === "monthly" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Day of Month</label>
                <input type="number" min="1" max="31" value={dom} onChange={(e) => setDom(Number(e.target.value))} className={`${selectClass} w-24`} />
              </div>
            )}
            {(preset === "hourly" || preset === "daily" || preset === "weekly" || preset === "monthly") && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">{preset === "hourly" ? "At Minute (of :mm)" : "At Time"}</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${selectClass} [color-scheme:dark]`} />
              </div>
            )}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <code className="flex-grow bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-violet-300 font-mono text-lg tracking-widest">{builtExpr}</code>
            <button
              onClick={() => setExpr(builtExpr)}
              className="px-4 py-3 text-sm font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg whitespace-nowrap"
            >
              Use This ↑
            </button>
            <CopyButton
              text={builtExpr}
              label="Copy"
              copiedClass="bg-violet-500/20 text-violet-400 border border-violet-500/50"
            />
          </div>
        </div>
      </div>

      {result && !result.error && result.sched && (
        <>
          {/* Description */}
          <div className="mb-8 p-5 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-200 text-lg font-medium">
            &ldquo;{result.description}&rdquo;
            <span className="text-sm text-violet-400/80 ml-2">— evaluated in {tz.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Field breakdown */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg overflow-x-auto custom-scrollbar">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Field Breakdown</h2>
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-6 font-semibold">Field</th>
                    <th className="py-2 pr-6 font-semibold">Raw</th>
                    <th className="py-2 font-semibold">Matches</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[result.sched.minutes, result.sched.hours, result.sched.doms, result.sched.months, result.sched.dows].map((values, i) => (
                    <tr key={FIELD_LABELS[i]} className="border-t border-white/5">
                      <td className="py-3 pr-6 text-slate-400">{FIELD_LABELS[i]}</td>
                      <td className="py-3 pr-6 font-mono text-violet-300">{result.sched.raw[i]}</td>
                      <td className="py-3 font-mono text-xs">
                        {i === 4 ? result.sched.dows.map((d) => DAY_FULL[d].slice(0, 3)).join(", ") : fieldValues(values)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Next runs */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg overflow-x-auto custom-scrollbar">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Next 5 Runs</h2>
              {result.runs.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming runs found (the schedule may never match, e.g. Feb 30).</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-2 pr-6 font-semibold">KST</th>
                      <th className="py-2 pr-6 font-semibold">UTC</th>
                      <th className="py-2 font-semibold">Relative</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-300">
                    {result.runs.map((run) => (
                      <tr key={run} className="border-t border-white/5">
                        <td className="py-3 pr-6 text-teal-300">{formatInZone(run, KST_OFFSET)}</td>
                        <td className="py-3 pr-6">{formatInZone(run, 0)}</td>
                        <td className="py-3 font-sans text-slate-400">{relativeTime(run, result.now)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
