# NodeFlux

A developer-focused visual workflow automation builder. NodeFlux allows you to construct complex API data pipelines and AI logic sequences using a directed acyclic graph (DAG) interface.

## Features

- **Visual DAG Builder:** Drag-and-drop interface powered by ReactFlow for constructing workflow pipelines.
- **Topological Execution Engine:** Custom backend execution engine that parses the DAG, resolves dependencies, and executes nodes in topological order.
- **Dynamic Variable Interpolation:** Pass data seamlessly between nodes (e.g., `{{node_1.output.id}}`).
- **AI Integration:** Built-in AI processing nodes powered by Gemini.
- **Server-Side Execution:** Workflows are executed securely on the backend, protected by Supabase Auth and RLS.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Zustand, Tailwind CSS, @xyflow/react
- **Backend:** Next.js Route Handlers (API), Supabase (PostgreSQL + Auth)
- **AI Engine:** Google Gemini (gemini-flash-latest)

## Local Development

```bash
# Install dependencies
npm install

# Setup environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...

# Run the development server
npm run dev
```

## Architecture Notes
The core of NodeFlux is its execution engine located in `src/lib/engine.ts`. When a workflow is triggered, the engine calculates the in-degrees of all nodes to perform a Kahn's topological sort, ensuring that any node relying on upstream data waits until those dependencies resolve. Each node type utilizes the Strategy Pattern via dedicated Runners to process inputs safely.
