"use client";

import { useState, useEffect, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";
import { KST_OFFSET, formatInZone, relativeTime } from "@/lib/time";

export default function EpochConverter() {
  const [now, setNow] = useState(0);
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dateTz, setDateTz] = useState<"kst" | "utc">("kst");

  // Live clock; started after mount to avoid SSR hydration mismatch
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const tsResult = useMemo(() => {
    const raw = tsInput.trim();
    if (!raw) return null;
    if (!/^-?\d+(\.\d+)?$/.test(raw)) return { error: "Enter a numeric Unix timestamp." };
    const num = Number(raw);
    // 13+ digit values are treated as milliseconds
    const isMs = Math.abs(num) >= 1e12;
    const ms = isMs ? num : num * 1000;
    if (!Number.isFinite(ms) || Math.abs(ms) > 8.64e15) return { error: "Timestamp out of range." };
    return { ms, unit: isMs ? "milliseconds" : "seconds", error: null };
  }, [tsInput]);

  const dateResult = useMemo(() => {
    if (!dateInput) return null;
    const m = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    const [, y, mo, d, h, mi, s] = m;
    const ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(s ?? "0")) - (dateTz === "kst" ? KST_OFFSET : 0);
    return { ms };
  }, [dateInput, dateTz]);

  const rowClass = "flex justify-between items-center gap-4 px-4 py-3 bg-black/40 border border-white/5 rounded-xl";
  const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0";
  const valueClass = "font-mono text-sm text-teal-300 break-all text-right";

  return (
    <ToolLayout
      glow="top-0 right-0 bg-teal-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Epoch / Timestamp</span> Converter
        </>
      }
      description="Convert Unix timestamps into human-readable KST/UTC dates and back. Seconds vs milliseconds are detected automatically — perfect for reading DB logs and API payloads."
    >
      {/* Live current time */}
      <div className="mb-8 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            Current Time
          </h2>
          <CopyButton text={now ? String(Math.floor(now / 1000)) : ""} label="Copy Unix Seconds" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className={rowClass}><span className={labelClass}>Unix (s)</span><span className={valueClass}>{now ? Math.floor(now / 1000) : "-"}</span></div>
          <div className={rowClass}><span className={labelClass}>Unix (ms)</span><span className={valueClass}>{now || "-"}</span></div>
          <div className={rowClass}><span className={labelClass}>KST</span><span className={valueClass}>{now ? formatInZone(now, KST_OFFSET) : "-"}</span></div>
          <div className={rowClass}><span className={labelClass}>UTC</span><span className={valueClass}>{now ? formatInZone(now, 0) : "-"}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timestamp -> Date */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <label className="text-lg font-semibold text-slate-200 mb-4">Timestamp &rarr; Date</label>
          <input
            type="text"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="e.g. 1724652000 or 1724652000000"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
          />
          <p className="text-xs text-slate-500 mt-2 mb-4">10 digits &rarr; seconds, 13 digits &rarr; milliseconds (auto-detected)</p>

          {tsResult?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{tsResult.error}</div>
          )}
          {tsResult && !tsResult.error && tsResult.ms !== undefined && (
            <div className="space-y-3">
              <div className={rowClass}><span className={labelClass}>Detected Unit</span><span className={valueClass}>{tsResult.unit}</span></div>
              <div className={rowClass}><span className={labelClass}>KST</span><span className={valueClass}>{formatInZone(tsResult.ms, KST_OFFSET)}</span></div>
              <div className={rowClass}><span className={labelClass}>UTC</span><span className={valueClass}>{formatInZone(tsResult.ms, 0)}</span></div>
              <div className={rowClass}><span className={labelClass}>Relative</span><span className={valueClass}>{now ? relativeTime(tsResult.ms, now) : "-"}</span></div>
            </div>
          )}
        </div>

        {/* Date -> Timestamp */}
        <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <label className="text-lg font-semibold text-slate-200 mb-4">Date &rarr; Timestamp</label>
          <div className="flex gap-3">
            <input
              type="datetime-local"
              step="1"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50 transition-colors [color-scheme:dark]"
            />
            <select
              value={dateTz}
              onChange={(e) => setDateTz(e.target.value as "kst" | "utc")}
              className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-teal-500/50"
              aria-label="Input Timezone"
            >
              <option value="kst">KST</option>
              <option value="utc">UTC</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 mt-2 mb-4">The entered date is interpreted as {dateTz.toUpperCase()} time</p>

          {dateResult && (
            <div className="space-y-3">
              <div className={rowClass}>
                <span className={labelClass}>Unix (s)</span>
                <div className="flex items-center gap-3">
                  <span className={valueClass}>{Math.floor(dateResult.ms / 1000)}</span>
                  <CopyButton text={String(Math.floor(dateResult.ms / 1000))} label="Copy" />
                </div>
              </div>
              <div className={rowClass}>
                <span className={labelClass}>Unix (ms)</span>
                <div className="flex items-center gap-3">
                  <span className={valueClass}>{dateResult.ms}</span>
                  <CopyButton text={String(dateResult.ms)} label="Copy" />
                </div>
              </div>
              <div className={rowClass}><span className={labelClass}>{dateTz === "kst" ? "UTC" : "KST"}</span><span className={valueClass}>{formatInZone(dateResult.ms, dateTz === "kst" ? 0 : KST_OFFSET)}</span></div>
              <div className={rowClass}><span className={labelClass}>Relative</span><span className={valueClass}>{now ? relativeTime(dateResult.ms, now) : "-"}</span></div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
