import Link from "next/link";
export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-indigo-300 selection:text-black overflow-hidden bg-black text-slate-100 font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Automation Area</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#tools" className="hover:text-white transition-colors">Tools</a>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">Open Static Automation Site</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600">
              Automate
            </span>
            <br />
            Everything.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 font-light">
            An open-source, completely static automation playground. 
            Built with Next.js, styled with Tailwind CSS, and automatically deployed via GitHub Pages.
          </p>

          {/* Tools Directory */}
          <div id="tools" className="mt-32 text-left max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Automation Tools
            </h2>
            
            {/* Category: Generators */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-slate-200">🏗️ Generators</h3>
                <div className="h-px bg-white/10 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/tools/uuid-generator" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(16,185,129,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-300 transition-colors">UUID/GUID Generator</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Generate random, unique Version 4 UUIDs instantly in bulk with customizable formats.
                  </p>
                </Link>

                <Link href="/tools/dummy-data-factory" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(245,158,11,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-300 transition-colors">Dummy Data Factory</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Generate realistic-looking mock JSON or CSV data instantly in your browser.
                  </p>
                </Link>
              </div>
            </div>

            {/* Category: Text & Formats */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-slate-200">📝 Text & Formats</h3>
                <div className="h-px bg-white/10 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/tools/text-to-single-line" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(99,102,241,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-300 transition-colors">Multiline to Single</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Convert multiline text blocks (JSON, Prompts) into a single string with \n escape characters.
                  </p>
                </Link>
                
                <Link href="/tools/json-bulk-editor" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">JSON Bulk Editor</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    View JSON arrays as spreadsheets. Edit cells or bulk replace whole columns with your real data.
                  </p>
                </Link>
              </div>
            </div>

            {/* Category: Database & SQL */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-slate-200">🗄️ Database & SQL</h3>
                <div className="h-px bg-white/10 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/tools/sql-in-formatter" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(244,63,94,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-rose-300 transition-colors">SQL IN Clause Formatter</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Instantly format Excel or text lists into SQL WHERE IN (&apos;...&apos;, &apos;...&apos;) query syntax.
                  </p>
                </Link>

                <Link href="/tools/sql-bulk-inserter" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">SQL Bulk Inserter</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Instantly convert JSON arrays or CSV files into <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-slate-300">INSERT INTO</code> script statements.
                  </p>
                </Link>

                <Link href="/tools/sql-parameter-binder" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(245,158,11,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-300 transition-colors">SQL Parameter Binder</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Convert <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-slate-300">sp_executesql</code> profiler logs into raw, executable SQL queries by binding parameters.
                  </p>
                </Link>
              </div>
            </div>

            {/* Category: Security & Encoders */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-slate-200">🔐 Encoders & Security</h3>
                <div className="h-px bg-white/10 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/tools/env-converter" className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(217,70,239,0.5)]">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-fuchsia-300 transition-colors">Config Converter</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Convert configurations seamlessly between <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-slate-300">.env</code>, <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-slate-300">JSON</code>, and <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-slate-300">YAML</code> formats handling nested keys.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}
