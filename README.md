# NodeFlux

Visual builder for AI workflows. Chain LLM prompts, HTTP requests, and data transforms on a canvas. Run on demand.

## Stack

- Next.js 15, TypeScript, Tailwind v4
- Supabase (auth + Postgres)
- @xyflow/react for the visual canvas
- Gemini for LLM calls

## Local dev

1. Copy `.env.example` to `.env.local` and fill in your Supabase and Gemini keys
2. Run the SQL in `src/lib/schema.sql` against your Supabase project
3. `npm install`
4. `npm run dev`

## License

MIT
