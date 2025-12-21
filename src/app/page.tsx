import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/workflows');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden font-body">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none nodeflux-hero-gradient opacity-100 dark:opacity-0 transition-opacity duration-700" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-6 text-sm font-medium">
            <ThemeToggle />
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </Link>
            <Link href="/register" className="rounded bg-foreground text-background px-4 py-2 hover:opacity-90 transition-opacity">
              Start building
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col items-center">
        {/* 1. HERO SECTION */}
        <section className="flex w-full max-w-[1100px] flex-col items-start px-6 pt-24 pb-20">
          <h1 className="max-w-[700px] font-headings text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight text-foreground">
            NodeFlux is a visual workflow engine for developers.
          </h1>
          <p className="mt-6 max-w-[600px] text-lg leading-relaxed text-muted-foreground">
            Wire HTTP calls, logic nodes, and data transforms on a canvas, then execute them directly in your browser. Built to be readable, typed, and predictable.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/register" className="rounded-md bg-foreground text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity">
              Open the editor
            </Link>
            <Link href="/login" className="rounded-md border border-border bg-panel px-6 py-3 font-medium text-foreground hover:bg-elevated transition-colors">
              Sign in to start
            </Link>
          </div>
        </section>

        {/* 2. WORKFLOW DIAGRAM SECTION */}
        <section className="w-full border-y border-border/50 bg-panel/30">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col lg:flex-row items-center gap-12 px-6 py-20">
            <div className="w-full lg:w-[40%] space-y-4">
              <h2 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
                What a NodeFlux workflow looks like
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Nodes execute in strict order from left to right. Each node receives the output payload of the previous node. If a step fails, execution halts and errors are caught in the console. No hidden magic, just sequential data processing.
              </p>
            </div>
            
            <div className="w-full lg:w-[60%] flex justify-end">
              {/* Pure HTML/CSS static diagram */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 w-full lg:w-auto">
                
                <div className="flex flex-col items-center justify-center w-28 h-16 rounded border border-border bg-panel text-sm font-medium shadow-sm">
                  Webhook
                </div>
                
                <div className="hidden sm:block h-px w-6 bg-border relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-border rotate-45"></div>
                </div>
                <div className="sm:hidden w-px h-6 bg-border relative my-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-border rotate-45"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-28 h-16 rounded border border-border bg-panel text-sm font-medium shadow-sm">
                  Parse JSON
                </div>

                <div className="hidden sm:block h-px w-6 bg-border relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-border rotate-45"></div>
                </div>
                <div className="sm:hidden w-px h-6 bg-border relative my-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-border rotate-45"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-28 h-16 rounded border border-border bg-panel text-sm font-medium shadow-sm">
                  Format
                </div>

                <div className="hidden sm:block h-px w-6 bg-border relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-border rotate-45"></div>
                </div>
                <div className="sm:hidden w-px h-6 bg-border relative my-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-border rotate-45"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-28 h-16 rounded border border-border bg-panel text-sm font-medium shadow-sm">
                  HTTP POST
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. CONCRETE SECTIONS */}
        <div className="flex w-full flex-col gap-24 py-24">
          
          {/* Section A */}
          <section className="mx-auto flex w-full max-w-[1100px] flex-col md:flex-row items-center gap-16 px-6">
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
                Built for how developers think
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                NodeFlux treats workflows like functions. You define inputs, process them through specific logic nodes, and return an output.
              </p>
              <ul className="space-y-3 text-[15px] text-muted-foreground">
                <li className="flex gap-2"><span className="text-foreground font-bold">›</span> Composable node types (HTTP, logic, triggers).</li>
                <li className="flex gap-2"><span className="text-foreground font-bold">›</span> Edit node properties in a dedicated side panel.</li>
                <li className="flex gap-2"><span className="text-foreground font-bold">›</span> Canvas and execution console live in the same view.</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 flex justify-end">
              {/* Abstract UI wireframe */}
              <div className="w-full max-w-[440px] aspect-[4/3] rounded-lg border border-border bg-background p-4 shadow-sm flex gap-4">
                {/* Canvas area */}
                <div className="flex-1 rounded border border-border/50 bg-panel/30 p-4 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-24 h-10 rounded border border-border bg-panel"></div>
                  <div className="absolute top-8 left-[110px] w-8 h-px bg-border"></div>
                  <div className="absolute top-6 left-36 w-24 h-10 rounded border border-border bg-panel"></div>
                </div>
                {/* Side panel area */}
                <div className="w-[120px] rounded border border-border/50 bg-panel/30 p-3 flex flex-col gap-3">
                  <div className="h-3 w-16 bg-border/50 rounded-sm"></div>
                  <div className="h-2 w-full bg-border/30 rounded-sm"></div>
                  <div className="h-2 w-3/4 bg-border/30 rounded-sm"></div>
                  <div className="h-8 w-full border border-border bg-background rounded mt-auto"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section B */}
          <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-10 px-6">
            <div className="space-y-3 max-w-[600px]">
              <h3 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
                From draft flow to real runs
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                The loop is tight: build the graph, map the fields, and hit run. No deployment steps required to test your logic.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-6 shadow-sm transition-transform duration-150 ease-out hover:-translate-y-[2px] hover:border-border/80">
                <h4 className="font-headings font-medium text-foreground">1. Sketch the nodes</h4>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Drop nodes onto the canvas to outline the steps of your process. Keep it simple and focused.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-6 shadow-sm transition-transform duration-150 ease-out hover:-translate-y-[2px] hover:border-border/80">
                <h4 className="font-headings font-medium text-foreground">2. Wire data between steps</h4>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Connect handles to pass JSON payloads from one node's output into the next node's input.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-6 shadow-sm transition-transform duration-150 ease-out hover:-translate-y-[2px] hover:border-border/80">
                <h4 className="font-headings font-medium text-foreground">3. Run and inspect logs</h4>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Trigger execution from the top bar. Read the exact JSON outputs and error traces in the execution console.
                </p>
              </div>
            </div>
          </section>

          {/* Section C */}
          <section className="mx-auto flex w-full max-w-[1100px] flex-col md:flex-row items-center gap-16 px-6">
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
                What this site actually does
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                NodeFlux is a full-stack Next.js application built to demonstrate a functional node-based editor. 
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="rounded-lg border border-border bg-panel p-6 shadow-sm text-[14px]">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex flex-col">
                    <span className="text-foreground font-medium">Authentication</span>
                    <span>Handled securely via Supabase (email/password sessions).</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-foreground font-medium">Storage</span>
                    <span>Workflows are serialized and saved per user in Postgres.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-foreground font-medium">Editor Engine</span>
                    <span>Canvas built with ReactFlow, execution handled sequentially via custom logic in <code className="bg-background border border-border rounded px-1 py-0.5 text-[12px]">lib/engine.ts</code>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/50 bg-background relative z-10">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col md:flex-row items-center justify-between px-6 py-8 gap-4">
          <BrandLogo compact={true} />
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="https://github.com/shreyanshtripathi-01/NodeFlux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
