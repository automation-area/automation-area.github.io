# Automation Area

A collection of free, browser-only developer utility tools. Everything runs client-side — no server, no data leaves your browser.

**Live site:** https://automation-area.github.io

## Tools

### 🏗️ Generators
- **UUID/GUID Generator** — bulk Version 4 UUIDs with format options (uppercase, no hyphens, braces, quotes)
- **Dummy Data Factory** — schema-based mock data generation, export to JSON/CSV

### 📝 Text & Formats
- **Multiline to Single** — convert multiline text into a single `\n`-escaped string
- **JSON Bulk Editor** — view a JSON array as a spreadsheet, edit cells or bulk-replace columns

### 🗄️ Database & SQL
- **SQL IN Clause Formatter** — turn Excel/text lists into `WHERE IN ('...', '...')` syntax
- **SQL Bulk Inserter** — convert JSON/CSV into batched `INSERT INTO` scripts
- **SQL Parameter Binder** — bind `sp_executesql` / EF Core log parameters into a runnable raw query

### 🔐 Encoders & Security
- **Config Converter** — convert between `.env`, JSON, and YAML with nested-key handling

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- [Tailwind CSS](https://tailwindcss.com) v4
- TypeScript
- Deployed to GitHub Pages via GitHub Actions ([deploy.yml](.github/workflows/deploy.yml))

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export to ./out
npm run lint
```

## Adding a Tool

1. Add an entry to `src/lib/tools.ts` (title, description, category, icon, colors) — the landing page card is generated from it.
2. Create `src/app/tools/<slug>/page.tsx` using the shared `ToolLayout` and `CopyButton` components.
3. Create `src/app/tools/<slug>/layout.tsx` exporting `toolMetadata("<slug>")` for the page title/description.
