import Link from "next/link";
import type { ReactNode } from "react";

// Shared page shell for every tool: ambient glow, back link, heading, description.
export default function ToolLayout({
  glow,
  heading,
  description,
  maxWidth = "max-w-5xl",
  children,
}: {
  glow: string; // position + color classes, e.g. "top-0 right-0 bg-indigo-500/10"
  heading: ReactNode;
  description: ReactNode;
  maxWidth?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      <div
        className={`absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none ${glow}`}
      ></div>

      <div className={`${maxWidth} mx-auto relative z-10`}>
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{heading}</h1>
        <p className="text-slate-400 mb-12 max-w-2xl text-lg">{description}</p>

        {children}
      </div>
    </div>
  );
}
