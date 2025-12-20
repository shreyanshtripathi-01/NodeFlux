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
      {/* Background styling for Light Mode Gradient */}
      <div className="absolute inset-0 pointer-events-none nodeflux-hero-gradient opacity-100 dark:opacity-0 transition-opacity duration-700" />
      
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-4">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-6 text-sm font-medium">
            <ThemeToggle />
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors relative group">
              {t('Log In')}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/register" className="group relative overflow-hidden rounded-lg bg-foreground text-background px-5 py-2.5 transition-transform hover:scale-105 active:scale-95 shadow-lg">
              <span className="relative z-10 flex items-center gap-2">{t('Get Started')} <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" /></span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col">
        {/* HERO SECTION */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col lg:flex-row items-center gap-16 px-8 pb-32 pt-24 lg:pt-32">
          
          <div className="flex flex-col gap-8 w-full lg:w-1/2 relative z-20">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/50 bg-panel/50 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span>{t('v0.1.0-beta')}</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="font-headings text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.05] tracking-tighter text-foreground">
                {t('Visual API Workflows.')}<br/>
                <span className="text-muted-foreground">{t('For Developers.')}</span>
              </h1>
              <p className="max-w-[500px] text-lg lg:text-xl leading-relaxed text-muted-foreground font-medium">
                {t('Chain APIs, webhooks, and AI models in a topological visual builder. Define cyclic dependencies and catch infinite loops before they hit your infrastructure.')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/register" className="group flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 font-semibold text-background transition-transform hover:-translate-y-0.5 shadow-xl">
                {t('Start Building')}
                <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-background/20 bg-background/10 px-2 py-0.5 text-[10px] font-sans opacity-70 ml-2">⌘K</kbd>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end perspective-container">
            {/* The 3D CSS Window Graphic */}
            <div className="window-3d relative w-full max-w-[560px] aspect-[4/3] rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden flex flex-col">
              
              {/* Browser/Terminal Header */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-panel/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/80 border border-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80 border border-success"></div>
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-3 py-1 text-[11px] font-mono text-muted-foreground">
                  <span className="opacity-50">shreyanshtripathi-01 / </span><span>nodeflux-core</span>
                </div>
                <div className="w-12"></div> {/* Spacer for centering */}
              </div>

              {/* Window Body (Static Flow Graph) */}
              <div className="relative flex-1 bg-grid-pattern p-8 flex flex-col gap-8 justify-center nodeflux-grid">
                 
                 {/* Connection Lines (SVG) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <path d="M 120 100 C 180 100, 220 180, 280 180" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 280 180 C 340 180, 380 100, 440 100" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
                 </svg>
                 
                 <div className="relative z-10 flex justify-start pl-8">
                    <div className="w-64 rounded-xl border border-border bg-panel shadow-lg flex items-center p-3 gap-3 transform -rotate-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Webhook Trigger</span>
                        <span className="text-[10px] font-mono text-muted-foreground">POST /api/v1/incoming</span>
                      </div>
                    </div>
                 </div>

                 <div className="relative z-10 flex justify-center">
                    <div className="w-64 rounded-xl border border-success/30 bg-success/5 shadow-[0_0_20px_rgba(74,222,128,0.1)] flex items-center p-3 gap-3 transform rotate-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-success text-success-foreground shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">LLM Transform</span>
                        <span className="text-[10px] font-mono text-success">Parsing JSON payload...</span>
                      </div>
                    </div>
                 </div>

                 <div className="relative z-10 flex justify-end pr-8">
                    <div className="w-64 rounded-xl border border-border bg-panel shadow-lg flex items-center p-3 gap-3 transform -rotate-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Postgres Insert</span>
                        <span className="text-[10px] font-mono text-muted-foreground">db.users.insert()</span>
                      </div>
                    </div>
                 </div>

              </div>
            </div>
          </div>
        </section>

        {/* WHY WE BUILT THIS */}
        <section className="border-y border-border/50 bg-panel/30">
          <div className="mx-auto max-w-[800px] px-8 py-24 text-center">
            <h2 className="font-headings text-3xl font-bold tracking-tight text-foreground mb-6">
              Why we built NodeFlux.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground font-medium">
              We were tired of dragging and dropping on clunky, opaque platforms. We wanted an orchestration tool that felt like a real IDE, where data flowed predictably and outputs were strictly typed. A tool that didn't hide the complexity, but gave engineers the primitive blocks to manage it beautifully. So we built it.
            </p>
          </div>
        </section>

        {/* FEATURES (BROKEN GRID) */}
        <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-32 px-8 py-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/3">
              <div className="font-headings text-[120px] leading-none font-bold text-border select-none -ml-4">
                01
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="font-headings text-3xl font-bold tracking-tight text-foreground">
                Topological Execution Engine
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Powered by a custom DAG execution engine. Nodes execute in strict dependency order, automatically parallelizing independent branches and handling retries on a per-node basis.
              </p>
            </div>
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/3 flex justify-end">
              <div className="font-headings text-[120px] leading-none font-bold text-border select-none -mr-4">
                02
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-4 md:text-right">
              <h3 className="font-headings text-3xl font-bold tracking-tight text-foreground">
                Type-Safe Data Payloads
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Data doesn't just flow blindly—it validates. Every node output is strictly typed. If a downstream node expects a string but receives an object, the editor highlights the type mismatch before you even click deploy.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/3">
              <div className="font-headings text-[120px] leading-none font-bold text-border select-none -ml-4">
                03
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="font-headings text-3xl font-bold tracking-tight text-foreground">
                Instant Edge Deployment
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Hit deploy, and your visual graph compiles down to a highly optimized serverless edge function in milliseconds. Monitor execution logs in real-time straight from the canvas.
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/50 bg-background relative z-10">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col md:flex-row items-center justify-between px-8 py-8 gap-6">
          <div className="flex items-center gap-4">
            <BrandLogo compact={true} />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
              Engineered for scale.
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-panel px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span>All systems operational</span>
            </div>
            <a 
              href="https://github.com/shreyanshtripathi-01/NodeFlux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
