"use client";

import { useState, useEffect, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import ToolLayout from "@/components/ToolLayout";
import { KST_OFFSET, formatInZone, relativeTime } from "@/lib/time";

function b64urlDecode(s: string): string {
  const rem = s.length % 4;
  const pad = rem === 2 ? "==" : rem === 3 ? "=" : "";
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const TIME_CLAIMS: { key: string; label: string }[] = [
  { key: "exp", label: "Expiration (exp)" },
  { key: "iat", label: "Issued At (iat)" },
  { key: "nbf", label: "Not Before (nbf)" },
];

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [now, setNow] = useState(0);

  // Ticker so the expiry badge stays current while a token is displayed
  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const decoded = useMemo(() => {
    const raw = input.trim().replace(/^Bearer\s+/i, "");
    if (!raw) return null;
    const parts = raw.split(".");
    if (parts.length < 2) {
      return { error: "A JWT must have at least two dot-separated parts (header.payload)." };
    }
    try {
      const header = JSON.parse(b64urlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(b64urlDecode(parts[1])) as Record<string, unknown>;
      return { header, payload, signature: parts[2] ?? "", error: null };
    } catch {
      return { error: "Failed to decode. Check that the token is valid base64url-encoded JSON." };
    }
  }, [input]);

  const loadExample = () => {
    const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: "1234567890",
      name: "John Doe",
      role: "admin",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    setInput(`${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}.dummy-signature`);
  };

  const exp = decoded && !decoded.error && typeof decoded.payload?.exp === "number" ? decoded.payload.exp : null;
  const isExpired = exp !== null && now > 0 && exp * 1000 < now;

  return (
    <ToolLayout
      glow="top-0 right-1/4 bg-red-500/10"
      heading={
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">JWT</span> Decoder
        </>
      }
      description="Decode JSON Web Tokens entirely in your browser — nothing is sent to any server. Inspect the header and payload, and check exp/iat/nbf claims against KST and UTC time."
    >
      {/* Token input */}
      <div className="mb-8 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold text-slate-200">Encoded Token</label>
          <button
            onClick={loadExample}
            className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-slate-300 transition-colors"
          >
            Load Example
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a JWT here... (eyJhbGciOi...)"
          className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-red-300 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors resize-y custom-scrollbar break-all"
        />
        {decoded?.error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{decoded.error}</div>
        )}
      </div>

      {decoded && !decoded.error && (
        <>
          {/* Expiry banner */}
          {exp !== null && now > 0 && (
            <div
              className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
                isExpired
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <span className={`flex h-2.5 w-2.5 rounded-full ${isExpired ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`}></span>
              {isExpired
                ? `Token EXPIRED (${relativeTime(exp * 1000, now)})`
                : `Token valid — expires ${relativeTime(exp * 1000, now)}`}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Header */}
            <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold text-slate-200">Header</label>
                <CopyButton text={JSON.stringify(decoded.header, null, 2)} label="Copy" />
              </div>
              <pre className="flex-grow bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-rose-300 font-mono text-sm overflow-auto custom-scrollbar">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold text-slate-200">Payload</label>
                <CopyButton text={JSON.stringify(decoded.payload, null, 2)} label="Copy" />
              </div>
              <pre className="flex-grow bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-amber-200 font-mono text-sm overflow-auto custom-scrollbar">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Time claims */}
          {TIME_CLAIMS.some(({ key }) => typeof decoded.payload?.[key] === "number") && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg overflow-x-auto custom-scrollbar">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Time Claims</h2>
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-6 font-semibold">Claim</th>
                    <th className="py-2 pr-6 font-semibold">Unix</th>
                    <th className="py-2 pr-6 font-semibold">KST</th>
                    <th className="py-2 pr-6 font-semibold">UTC</th>
                    <th className="py-2 font-semibold">Relative</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-300">
                  {TIME_CLAIMS.map(({ key, label }) => {
                    const v = decoded.payload?.[key];
                    if (typeof v !== "number") return null;
                    return (
                      <tr key={key} className="border-t border-white/5">
                        <td className="py-3 pr-6 font-sans text-slate-400">{label}</td>
                        <td className="py-3 pr-6">{v}</td>
                        <td className="py-3 pr-6 text-teal-300">{formatInZone(v * 1000, KST_OFFSET)}</td>
                        <td className="py-3 pr-6">{formatInZone(v * 1000, 0)}</td>
                        <td className="py-3 text-slate-400">{now ? relativeTime(v * 1000, now) : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ToolLayout>
  );
}
