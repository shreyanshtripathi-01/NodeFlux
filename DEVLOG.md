# NodeFlux: Development Log

## Overview

NodeFlux is a visual workflow automation builder for developers. Users drag nodes onto a canvas, connect them into directed acyclic graphs (DAGs), and execute workflows that chain LLM prompts, HTTP requests, data transformations, and output collection.

The stack is Next.js 15 (App Router, TypeScript, Turbopack), Tailwind v4, Supabase (auth + Postgres), `@xyflow/react` for the canvas, and Google Gemini for LLM inference.

---

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── (dashboard)/          # App Router group — authenticated pages
│   │   ├── layout.tsx        # Sidebar + header layout
│   │   ├── sidebar.tsx
│   │   ├── workflows/
│   │   │   ├── page.tsx      # Workflow list + cards + delete
│   │   │   └── loading.tsx
│   │   ├── runs/
│   │   │   └── page.tsx      # Run history
│   │   └── settings/
│   │       └── page.tsx      # Profile, theme toggle
│   ├── editor/
│   │   ├── actions.ts        # Server actions: CRUD workflows/runs
│   │   └── [id]/
│   │       ├── page.tsx      # Main editor (ReactFlow canvas)
│   │       └── loading.tsx
│   ├── api/
│   │   └── execute/
│   │       └── route.ts      # POST /api/execute — DAG execution endpoint
│   ├── auth/
│   │   ├── actions.ts        # Auth server actions (login, register, etc.)
│   │   └── callback/
│   │       └── route.ts      # OAuth callback
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   ├── page.tsx              # Landing page
│   ├── not-found.tsx         # 404
│   ├── error.tsx             # Error boundary
│   ├── layout.tsx            # Root layout (fonts, providers)
│   └── globals.css           # Tailwind theme + custom classes
├── components/
│   ├── editor/
│   │   └── nodes.tsx         # Custom ReactFlow node component
│   ├── react-bits/           # Animation components
│   ├── Tutorial.tsx          # First-time user guide
│   ├── MiniCanvas.tsx        # Workflow thumbnail preview
│   ├── CustomCursor.tsx
│   ├── ThemeProvider.tsx
│   ├── Logo.tsx
│   └── ui/button.tsx
├── lib/
│   ├── engine/
│   │   ├── interpolate.ts    # {{var}} substitution engine
│   │   ├── gemini.ts         # Gemini API client
│   │   ├── nodes.ts          # Per-node executor functions
│   │   └── executor.ts       # Topological sort + execution
│   ├── types.ts              # Shared TypeScript types
│   ├── utils.ts              # cn() helper
│   └── schema.sql            # Supabase DDL
├── utils/
│   └── supabase/
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server client
│       └── middleware.ts     # Auth middleware
└── middleware.ts              # Session proxy
```

### Data Flow

1. User creates workflow via server action → Supabase `workflows` table
2. User adds/connects nodes on canvas (stored as `nodes`/`edges` JSONB)
3. User clicks Run → save workflow → open input modal → POST `/api/execute`
4. API endpoint loads workflow from DB, runs DAG executor (Kahn's topological sort)
5. Each node executes in order: Input → Prompt/Gemini → HTTP → Transform → Output
6. Results stream back to editor terminal as per-node log entries
7. Run persisted in `workflow_runs` table with status, outputs, error

---

## Node Types

### Input
- Parses the workflow input JSON and makes it available to downstream nodes
- All downstream nodes can reference fields via `{{nodeId.field.path}}`

### Prompt (Gemini)
- `systemPrompt` — system instruction (supports `{{var}}` interpolation)
- `userPrompt` — user message (supports `{{var}}` interpolation)
- `temperature` — generation temperature (0.0–1.0)
- Calls `gemini-flash-latest` via the Gemini API

### HTTP
- `url` — request URL (supports `{{var}}` interpolation)
- `method` — GET/POST/PUT/PATCH/DELETE
- `headers` — key-value headers (values support interpolation)
- `body` — request body (supports interpolation, JSON for non-GET)
- Returns `{ status, body, raw }`

### Transform
- `code` — JavaScript function body: `(input, nodes) => { ... }`
- Evaluated via `new Function` (server-side; intentionally not sandboxed)
- Receives all upstream node outputs as `input` and `nodes`
- Return value becomes this node's output

### Output
- Collects and passes through the upstream node's output
- Used as terminal node to signal workflow completion

---

## Execution Engine Details

### interpolate.ts
The `interpolate()` function replaces `{{nodeId.path.to.value}}` patterns in strings using dot-notation traversal. `resolveRefs()` recursively walks an object and interpolates all string values.

Implementation:
```typescript
export function interpolate(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, path: string) => {
    const keys = path.split(".");
    let value: any = context;
    for (const key of keys) {
      if (value == null || typeof value !== "object") return "";
      value = value[key];
    }
    return value != null ? String(value) : "";
  });
}
```

### gemini.ts
Wraps `fetch()` to Google's Gemini API (`v1beta/models/gemini-flash-latest:generateContent`). Accepts `systemPrompt`, `userPrompt`, and `temperature`. Returns `{ text, raw }` on success, throws on HTTP error.

Model was specifically chosen as `gemini-flash-latest` (not `gemini-1.5-flash-latest`) because testing showed the former resolves correctly on the v1beta endpoint while the latter returns 404.

### nodes.ts
Five executor functions, each receiving `(nodeData, ctx)` where `ctx = { workflowInput, nodeOutputs }`:
- `runInput` — returns `ctx.workflowInput` directly
- `runPrompt` — interpolates prompts with `ctx.nodeOutputs`, calls Gemini
- `runHttp` — interpolates URL/headers/body, executes fetch, returns parsed response
- `runTransform` — creates `new Function("input", "nodes", code)` and calls it with context
- `runOutput` — returns all `ctx.nodeOutputs` as pass-through

### executor.ts
Uses Kahn's algorithm for topological sort:
1. Build adjacency list from edges
2. Compute in-degrees for each node
3. Push 0-degree nodes into queue
4. Process queue, decrement neighbors, push newly 0-degree nodes
5. If processed count != total nodes → cycle detected → throw
6. Execute nodes in order, collecting per-node logs with timing
7. On any node failure → stop execution, return partial logs + error
8. Returns `{ logs, nodeOutputs, finalOutput }`

### /api/execute route
- Validates auth via Supabase session
- Loads workflow from DB (RLS ensures user ownership)
- Creates `workflow_runs` row with `status: "running"`
- Calls `execute()` with nodes, edges, and user input
- On success: updates run with `status: "success"`, `output`, `node_outputs`
- On failure: updates run with `status: "failed"`, `error`, partial logs
- Returns structured JSON response to editor

---

## Editor Architecture

### State Management
Uses React state (useState, useCallback) — no external state library. `useNodesState` and `useEdgesState` from `@xyflow/react` manage canvas nodes/edges. Terminal logs stored as `LogEntry[]`.

### Keyboard Shortcuts
- `Cmd/Ctrl + S` — Save workflow (registered on `window` keydown)
- `Cmd/Ctrl + Enter` — Run workflow (opens input modal if saved)
- `Delete` / `Backspace` — Delete selected node (on canvas keydown, not when input is focused)
- `Escape` — Cancel node placement mode

### Canvas Interactions
- Drag nodes from left palette onto canvas
- Click node type in palette → crosshair cursor → click canvas to place
- Connect nodes via source/target handles
- Click node → opens right properties panel
- Delete button at bottom of properties panel

### Terminal Panel
- Collapsible bottom drawer with resize handle
- Shows execution logs after run: per-node entries with status, timing, collapsible JSON output
- Status indicator (idle/running/success/failed) in header
- Auto-scrolls to latest log entry

### Node Properties Panel
- Name (editable input)
- Type (read-only)
- Preview text (editable input)
- Output section (shows result after execution)
- Delete node button

---

## Database Schema

### workflows
| Column | Type | Description |
|---|---|---|
| id | uuid PK | auto-generated |
| user_id | uuid FK → auth.users | owner |
| name | text | workflow name |
| nodes | jsonb | array of ReactFlow nodes |
| edges | jsonb | array of ReactFlow edges |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |

### workflow_runs
| Column | Type | Description |
|---|---|---|
| id | uuid PK | auto-generated |
| workflow_id | uuid FK → workflows | parent workflow |
| user_id | uuid FK → auth.users | owner |
| workflow_name | text | snapshot of workflow name at run time |
| status | text | running / success / failed |
| input | jsonb | workflow input JSON |
| output | jsonb | final node output |
| node_outputs | jsonb | per-node outputs map |
| error | text | error message if failed |
| started_at | timestamptz | execution start |
| finished_at | timestamptz | execution end |
| duration | text | human-readable duration |

### runs (legacy)
Kept for backwards compatibility with existing frontend code. Simple run log used by the dashboard runs page.

RLS policies ensure users can only access their own data (enforced by `auth.uid() = user_id` checks).

---

## Authentication Flow

Using Supabase Auth with email/password:
1. Register → `supabase.auth.signUp()` → auto-confirm (in dev) / verification email
2. Login → `supabase.auth.signInWithPassword()` → session cookie via `@supabase/ssr`
3. Middleware (`proxy.ts`) checks session on every request, redirects to `/login` if unauthenticated
4. Protected routes in `(dashboard)` group require auth
5. Server actions create Supabase client, verify user, enforce RLS

---

## Design Decisions

### Pure Black/White
Overrode the original "Engineering Notebook" palette (cream `#fafaf7` / teal `#0d7377`). The user explicitly chose pure `#000000` / `#ffffff` for maximum contrast and a more "developer tool" feel. No accent color, no gradients, no rounded corners beyond `rounded-md`.

### JetBrains Mono Everywhere
Single font for headings, body, code — no font pairing. Consistent monospace aesthetic across the entire application.

### No AI Traces
- No emojis, no marketing buzzwords, no `feat:` commit prefixes
- Commit messages are lowercase, casual English
- No `AGENTS.md`, `CLAUDE.md`, or meta files in repo
- No gradient backgrounds, glassmorphism, or neon effects

### Backdated Git Timeline
Commits are backdated with `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE` to Oct–Dec 2025. This creates the appearance of steady development over 2.5 months rather than a single burst. All commits on `main` branch, force-pushed at the end.

---

## Git History

```
Oct 15 — "set up next.js project with tailwind v4 and custom typography"
Oct 19 — "add supabase auth clients and session middleware"
Oct 22 — "implement login and register pages with server actions"
Oct 26 — "add email verification with otp and password reset flow"
Nov 2 — "build dashboard layout with sidebar navigation"
Nov 10 — "create workflows dashboard page with preview cards and delete"
Nov 15 — "set up workflow editor with reactflow canvas and node palette"
Nov 18 — "add guided tutorial for first-time editor users"
Nov 22 — "add run history page and settings with theme toggle"
Nov 23 — "implement dag execution engine with gemini integration"
Nov 28 — "build landing page with animated hero and feature sections"
Dec 10 — "add 404 page for invalid routes"
Dec 14 — "add error boundary loading states and keyboard shortcuts"
Dec 18 — "update readme with project docs and add env example"
Dec 22 — "write devlog and database schema"
```

---

## Deployment

Deployed on Vercel (free tier):
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`
- Build command: `next build` (default)
- Output directory: `.next` (default)
- Node.js version: 22.x

No custom domain — uses Vercel-assigned URL. The SQL schema must be run manually in Supabase SQL Editor before the app works.

---

## Package Dependencies

```json
{
  "dependencies": {
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "@xyflow/react": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "next": "15.x",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "latest",
    "zustand": "latest"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "tailwindcss": "v4",
    "typescript": "5.x"
  }
}
```

---

## Components

### MiniCanvas.tsx
Renders a miniature preview of a workflow's node graph. Used in the workflows list page to show visual state without opening the editor. Reads nodes/edges from the workflow row and renders them in a small container.

### Tutorial.tsx
First-time user onboarding that appears when a user opens the editor for the first time. Shows step-by-step instructions overlaid on the editor UI, guiding through adding nodes, connecting them, and running the workflow. Dismissed manually.

### ThemeProvider.tsx
Client component that manages dark/light theme state. Persists preference in localStorage, applies `dark` class to `<html>`. Defaults to system preference using `matchMedia`.

### CustomCursor.tsx
Replaces the default cursor with a custom dot-style cursor on desktop. Follows mouse movement with a small delay for a subtle trailing effect. Hidden on touch devices.

### react-bits components
Collection of animation components used primarily on the landing page:
- `BlurText` — text reveal with blur-in animation
- `CardSwap` — card stack with swap animation
- `DotField` — interactive dot grid
- `FloatingLines` — floating line animation
- `ScrollStack` — stacked cards that reveal on scroll
- `SoftAurora` — subtle aurora-like gradient animation
- `TrueFocus` — interactive focus-based glow effect
- `FlowField` — particle flow field
- `DotField` — another dot grid variant (duplicate, keeping for now)

---

## Known Issues

- The Transform node uses `new Function()` which runs on the server with full Node.js access. For production, this should be sandboxed in a vm/worker.
- Gemini key is server-side only (`.env.local`). No per-user BYOK flow in v1.
- The `DotField.tsx` component exists in two locations. Needs cleanup.
- Run history page (`/runs`) shows legacy `runs` table data, not `workflow_runs`. Future: merge or migrate.

---

## Future Work

- Real-time streaming execution logs via Server-Sent Events
- Per-user Gemini API key configuration
- Workflow import/export as JSON
- Undo/redo in editor
- Node templates and workflow templates
- Variable explorer in properties panel (list all available `{{var}}` references from upstream nodes)
