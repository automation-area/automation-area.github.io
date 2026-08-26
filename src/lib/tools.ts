import type { Metadata } from "next";

// Single source of truth for every tool: landing page cards and per-tool
// metadata are both rendered from this list. Adding a tool = adding one entry.

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  // Tailwind can't build dynamic class names, so full class strings live here.
  iconPath: string;
  iconBg: string;
  iconColor: string;
  hoverTitle: string;
  hoverShadow: string;
}

export const CATEGORIES = [
  "🏗️ Generators",
  "📝 Text & Formats",
  "⏰ Time & Schedule",
  "🗄️ Database & SQL",
  "🔐 Encoders & Security",
] as const;

export const TOOLS: Tool[] = [
  {
    slug: "uuid-generator",
    title: "UUID/GUID Generator",
    description:
      "Generate random, unique Version 4 UUIDs instantly in bulk with customizable formats.",
    category: "🏗️ Generators",
    iconPath:
      "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    hoverTitle: "group-hover:text-emerald-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(16,185,129,0.5)]",
  },
  {
    slug: "dummy-data-factory",
    title: "Dummy Data Factory",
    description:
      "Generate realistic-looking mock JSON or CSV data instantly in your browser.",
    category: "🏗️ Generators",
    iconPath:
      "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    hoverTitle: "group-hover:text-amber-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(245,158,11,0.5)]",
  },
  {
    slug: "text-to-single-line",
    title: "Multiline to Single",
    description:
      "Convert multiline text blocks (JSON, Prompts) into a single string with \\n escape characters.",
    category: "📝 Text & Formats",
    iconPath: "M4 6h16M4 12h16m-7 6h7",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    hoverTitle: "group-hover:text-cyan-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(99,102,241,0.5)]",
  },
  {
    slug: "json-bulk-editor",
    title: "JSON Bulk Editor",
    description:
      "View JSON arrays as spreadsheets. Edit cells or bulk replace whole columns with your real data.",
    category: "📝 Text & Formats",
    iconPath:
      "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    hoverTitle: "group-hover:text-blue-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.5)]",
  },
  {
    slug: "sql-in-formatter",
    title: "SQL IN Clause Formatter",
    description:
      "Instantly format Excel or text lists into SQL WHERE IN ('...', '...') query syntax.",
    category: "🗄️ Database & SQL",
    iconPath:
      "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    hoverTitle: "group-hover:text-rose-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(244,63,94,0.5)]",
  },
  {
    slug: "sql-bulk-inserter",
    title: "SQL Bulk Inserter",
    description:
      "Instantly convert JSON arrays or CSV files into INSERT INTO script statements.",
    category: "🗄️ Database & SQL",
    iconPath:
      "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    hoverTitle: "group-hover:text-blue-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.5)]",
  },
  {
    slug: "sql-parameter-binder",
    title: "SQL Parameter Binder",
    description:
      "Convert sp_executesql profiler logs into raw, executable SQL queries by binding parameters.",
    category: "🗄️ Database & SQL",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    hoverTitle: "group-hover:text-amber-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(245,158,11,0.5)]",
  },
  {
    slug: "env-converter",
    title: "Config Converter",
    description:
      "Convert configurations seamlessly between .env, JSON, and YAML formats handling nested keys.",
    category: "🔐 Encoders & Security",
    iconPath: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    hoverTitle: "group-hover:text-fuchsia-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(217,70,239,0.5)]",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Beautify JSON with custom indentation or minify it into a single line, with optional key sorting.",
    category: "📝 Text & Formats",
    iconPath:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    hoverTitle: "group-hover:text-indigo-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(99,102,241,0.5)]",
  },
  {
    slug: "epoch-converter",
    title: "Epoch/Timestamp Converter",
    description:
      "Convert Unix timestamps to KST/UTC dates and back, with live current time and relative view.",
    category: "⏰ Time & Schedule",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400",
    hoverTitle: "group-hover:text-teal-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(20,184,166,0.5)]",
  },
  {
    slug: "cron-parser",
    title: "Cron Expression Parser",
    description:
      "Parse, build, and explain cron expressions with next run times in both KST and UTC.",
    category: "⏰ Time & Schedule",
    iconPath:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    hoverTitle: "group-hover:text-violet-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(139,92,246,0.5)]",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode JWT headers and payloads locally in your browser, with expiry (exp) status in KST/UTC.",
    category: "🔐 Encoders & Security",
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    hoverTitle: "group-hover:text-red-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(239,68,68,0.5)]",
  },
  {
    slug: "base64-url",
    title: "Base64 / URL Encoder",
    description:
      "Encode and decode Base64 (UTF-8 safe) and URL-encoded strings in one place.",
    category: "🔐 Encoders & Security",
    iconPath: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    hoverTitle: "group-hover:text-sky-300",
    hoverShadow: "hover:shadow-[0_10px_30px_-15px_rgba(14,165,233,0.5)]",
  },
];

export function toolMetadata(slug: string): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`);
  return { title: tool.title, description: tool.description };
}
