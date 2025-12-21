import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { t } from '@/components/global/t';
import BrandLogo from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChevronRight } from 'lucide-react';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/workflows');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none nodeflux-hero-gradient opacity-100 dark:opacity-0 transition-opacity duration-700" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-3.5">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-5 text-sm font-medium">
            <ThemeToggle />
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('Log In')}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all group-hover:w-full" />
            </Link>
            <Link href="/register" className="group rounded-lg bg-foreground text-background px-5 py-2 transition-all hover:opacity-90 active:scale-95">
              <span className="flex items-center gap-1.5">{t('Get Started')} <ChevronRight className="w-3.5 h-3.5 opacity-60" /></span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col">

        {/* ── HERO ── */}
        <section className="mx-auto flex w-full max-w-[1200px] flex-col lg:flex-row items-center gap-12 px-8 pb-20 pt-14 lg:pt-16">

          {/* Left — Copy */}
          <div className="flex flex-col gap-6 w-full lg:w-[55%]">
            <h1 className="font-headings text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tighter text-foreground">
              {t('Build workflows')}<br />
              <span className="text-muted-foreground">{t('visually.')}</span>
            </h1>
            <p className="max-w-[480px] text-base lg:text-lg leading-relaxed text-muted-foreground">
              {t('NodeFlux is a visual workflow builder for developers. Chain API calls, data transforms, and logic nodes on a drag-and-drop canvas — then deploy as a single endpoint.')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/register" className="rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-95 shadow-md">
                {t('Start Building')}
              </Link>
              <a href="https://github.com/shreyanshtripathi-01/NodeFlux" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-panel transition-colors">
                {t('View on GitHub')}
              </a>
            </div>
          </div>

          {/* Right — Simple Flowchart (matches real app node style) */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 340" fill="none">
                <path d="M 210 82 L 210 128" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M 210 208 L 120 248" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M 210 208 L 300 248" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>

              {/* Node 1 — Trigger */}
              <div className="relative flex justify-center mb-8">
                <div className="w-[220px] flex items-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-border/80 hover:-translate-y-0.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-mono font-bold">
                    T
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-foreground truncate">Webhook Trigger</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1.5 w-12 rounded-full bg-border" />
                      <div className="h-1.5 w-8 rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Node 2 — Transform */}
              <div className="relative flex justify-center mb-8">
                <div className="w-[220px] flex items-center gap-3 rounded-xl border border-success/40 bg-panel px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-success/60 hover:-translate-y-0.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success text-xs font-mono font-bold">
                    F
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-foreground truncate">Transform</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1.5 w-16 rounded-full bg-border" />
                      <div className="h-1.5 w-6 rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch — two output nodes */}
              <div className="relative flex justify-between px-2">
                <div className="w-[180px] flex items-center gap-3 rounded-xl border border-border bg-panel px-3 py-3 shadow-sm transition-all hover:shadow-md hover:border-border/80 hover:-translate-y-0.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-mono font-bold">
                    H
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-foreground truncate">HTTP Request</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1.5 w-10 rounded-full bg-border" />
                    </div>
                  </div>
                </div>

                <div className="w-[180px] flex items-center gap-3 rounded-xl border border-border bg-panel px-3 py-3 shadow-sm transition-all hover:shadow-md hover:border-border/80 hover:-translate-y-0.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-mono font-bold">
                    O
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-foreground truncate">Output</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1.5 w-8 rounded-full bg-border" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── WHY WE BUILT THIS ── */}
        <section className="border-y border-border/50 bg-panel/30">
          <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
            <h2 className="font-headings text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-5">
              Why we built NodeFlux.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We were tired of stitching together APIs with messy scripts and opaque automation platforms.
              We wanted something that felt like a real engineering tool — where data flows predictably,
              outputs are strictly typed, and you can actually see the execution path before hitting deploy.
              So we built it.
            </p>
          </div>
        </section>

        {/* ── FEATURES (BROKEN GRID) ── */}
        <section className="mx-auto flex w-full max-w-[960px] flex-col gap-20 px-8 py-20">

          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20">
            <div className="w-full md:w-1/3">
              <div className="font-headings text-[100px] leading-none font-bold text-border/60 select-none">01</div>
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <h3 className="font-headings text-2xl font-bold tracking-tight text-foreground">
                Drag-and-Drop Canvas
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                Build workflows on a real graph editor. Drop nodes for HTTP calls, data transforms, conditional logic, and AI models — then connect them visually. No YAML, no JSON configs to memorize.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-20">
            <div className="w-full md:w-1/3 flex md:justify-end">
              <div className="font-headings text-[100px] leading-none font-bold text-border/60 select-none">02</div>
            </div>
            <div className="w-full md:w-2/3 space-y-3 md:text-right">
              <h3 className="font-headings text-2xl font-bold tracking-tight text-foreground">
                Topological Execution
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                Nodes execute in strict dependency order using a DAG engine. Independent branches run in parallel automatically. If a node fails, only its dependents are affected — the rest of your workflow keeps going.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20">
            <div className="w-full md:w-1/3">
              <div className="font-headings text-[100px] leading-none font-bold text-border/60 select-none">03</div>
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <h3 className="font-headings text-2xl font-bold tracking-tight text-foreground">
                One-Click Deploy
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                When your workflow is ready, deploy it as a single API endpoint. Monitor execution logs in real-time right from the canvas. No separate deployment pipelines to configure.
              </p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="border-y border-border/50 bg-panel/20">
          <div className="mx-auto max-w-[1000px] px-8 py-20">
            <h2 className="font-headings text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="text-3xl font-headings font-bold text-muted-foreground/40 mb-4">1</div>
                <h3 className="font-headings text-lg font-semibold text-foreground mb-2">Design your flow</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Open the canvas editor and add nodes — triggers, HTTP requests, transforms, conditionals, or AI model calls. Connect them by dragging edges between handles.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="text-3xl font-headings font-bold text-muted-foreground/40 mb-4">2</div>
                <h3 className="font-headings text-lg font-semibold text-foreground mb-2">Configure each node</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Click any node to set its parameters — the URL for an HTTP call, the prompt for an AI node, or the condition for a logic gate. Data flows through automatically.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className="text-3xl font-headings font-bold text-muted-foreground/40 mb-4">3</div>
                <h3 className="font-headings text-lg font-semibold text-foreground mb-2">Execute &amp; deploy</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hit run to test your workflow end-to-end. Watch each node execute in order on the canvas. When it works, deploy it as a live endpoint with a single click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── NODE TYPES ── */}
        <section className="mx-auto max-w-[1000px] px-8 py-20">
          <h2 className="font-headings text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center mb-4">
            Built-in node types
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-[500px] mx-auto">
            Every node type you need to build production workflows, from simple HTTP calls to conditional branching.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { letter: 'T', name: 'Trigger', desc: 'Webhook or cron-based entry points that start your workflow.' },
              { letter: 'H', name: 'HTTP Request', desc: 'Make GET, POST, PUT, DELETE calls to any external API.' },
              { letter: 'F', name: 'Transform', desc: 'Map, filter, and reshape data between nodes with expressions.' },
              { letter: 'L', name: 'Logic Gate', desc: 'If/else branching based on conditions you define.' },
              { letter: 'A', name: 'AI Model', desc: 'Send prompts to language models and route the response downstream.' },
              { letter: 'O', name: 'Output', desc: 'Return a final response or write results to a destination.' },
              { letter: 'D', name: 'Delay', desc: 'Pause execution for a set duration between steps.' },
              { letter: 'R', name: 'Retry', desc: 'Automatically retry failed nodes with configurable backoff.' },
            ].map((node) => (
              <div key={node.letter} className="group rounded-xl border border-border bg-panel p-4 transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-mono font-bold">
                    {node.letter}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{node.name}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{node.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="border-t border-border/50">
          <div className="mx-auto max-w-[720px] px-8 py-20 text-center">
            <h2 className="font-headings text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to build?
            </h2>
            <p className="text-base text-muted-foreground mb-8 max-w-[400px] mx-auto">
              Create your first workflow in minutes. No credit card, no setup — just open the editor and start connecting nodes.
            </p>
            <Link href="/register" className="inline-flex rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-95 shadow-md">
              {t('Get Started for Free')}
            </Link>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-background relative z-10">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-8 py-6 text-sm text-muted-foreground">
          <BrandLogo compact={true} />
          <div className="flex items-center gap-6">
            <a href="https://github.com/shreyanshtripathi-01/NodeFlux" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
