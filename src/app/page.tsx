import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { t } from '@/components/global/t';
import BrandLogo from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChevronRight, GitMerge, Database, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

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
            <Link href="/register" className="group relative overflow-hidden rounded-md bg-foreground text-background px-4 py-2 transition-transform hover:scale-105 active:scale-95 shadow-md">
              <span className="relative z-10 flex items-center gap-2">{t('Get Started')}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col">
        {/* HERO SECTION */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col lg:flex-row items-center gap-12 px-8 pb-20 pt-16 lg:pt-24">
          
          <div className="flex flex-col gap-6 w-full lg:w-1/2 relative z-20">
            <div className="space-y-4">
              <h1 className="font-headings text-5xl sm:text-6xl font-semibold leading-[1.1] tracking-tight text-foreground">
                {t('Visual API Workflows.')}<br/>
                <span className="text-muted-foreground">{t('For Developers.')}</span>
              </h1>
              <p className="max-w-[500px] text-lg leading-relaxed text-muted-foreground">
                {t('Chain APIs, webhooks, and data models in a strict, type-safe topological builder. Catch infinite loops and schema mismatches before they reach production.')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register" className="group flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 shadow-lg">
                {t('Start Building')}
                <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            {/* Clean Flowchart Graphic */}
            <div className="relative w-full max-w-[500px] h-[360px] rounded-xl border border-border/50 bg-panel/30 flex items-center justify-center overflow-hidden">
               {/* Subtle Grid Background */}
               <div className="absolute inset-0 nodeflux-grid opacity-20"></div>
               
               {/* Connection Lines (SVG) */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <path d="M 150 120 C 200 120, 220 180, 260 180" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 150 240 C 200 240, 220 180, 260 180" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 380 180 L 440 180" fill="none" stroke="var(--color-border)" strokeWidth="2" />
                  <circle cx="440" cy="180" r="4" fill="var(--color-border)" />
               </svg>
               
               {/* Nodes */}
               <div className="absolute top-[90px] left-[30px] w-[120px] rounded-md border border-border bg-background p-3 shadow-sm flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" />
                 <span className="text-xs font-medium">Webhook</span>
               </div>

               <div className="absolute top-[210px] left-[30px] w-[120px] rounded-md border border-border bg-background p-3 shadow-sm flex items-center gap-2">
                 <Database className="w-4 h-4 text-blue-500" />
                 <span className="text-xs font-medium">Postgres</span>
               </div>

               <div className="absolute top-[150px] left-[260px] w-[120px] rounded-md border border-success/30 bg-success/10 p-3 shadow-sm flex items-center gap-2">
                 <GitMerge className="w-4 h-4 text-success" />
                 <span className="text-xs font-medium text-foreground">Transform</span>
               </div>
            </div>
          </div>
        </section>

        {/* WHY WE BUILT THIS */}
        <section className="border-y border-border/50 bg-panel/30">
          <div className="mx-auto max-w-[800px] px-8 py-16 text-center">
            <h2 className="font-headings text-2xl font-semibold tracking-tight text-foreground mb-4">
              Built for engineering precision.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We wanted an orchestration tool that felt like a real IDE, where data flowed predictably and outputs were strictly typed. A tool that didn't hide the complexity, but gave engineers the primitive blocks to manage it beautifully.
            </p>
          </div>
        </section>

        {/* CORE CAPABILITIES (New Section replacing old feature blocks) */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-8 py-20">
          <div className="text-center space-y-3 mb-8">
             <h2 className="font-headings text-3xl font-semibold tracking-tight text-foreground">Core Capabilities</h2>
             <p className="text-muted-foreground">Everything you need to orchestrate complex data flows.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-panel p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border/50 text-foreground">
                  <ShieldCheck className="w-5 h-5 text-success" />
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">Type-Safe Payloads</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">Data doesn't just flow—it validates. Every node output is strictly typed, preventing schema mismatches before deployment.</p>
            </div>
            
            <div className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-panel p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border/50 text-foreground">
                  <GitMerge className="w-5 h-5" />
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">Topological Execution</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">Powered by a custom DAG engine. Nodes execute in strict dependency order, automatically parallelizing independent branches.</p>
            </div>

            <div className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-panel p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border/50 text-foreground">
                  <Cpu className="w-5 h-5 text-blue-500" />
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">Edge Deployment</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">Deploy your visual graph as a highly optimized serverless function in milliseconds. Monitor execution logs in real-time.</p>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-8 py-20 border-t border-border/40">
           <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                 <h2 className="font-headings text-3xl font-semibold tracking-tight text-foreground">Designed for backend heavy-lifting.</h2>
                 <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                       <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5" />
                       <div>
                          <span className="font-medium text-foreground block">ETL Pipelines</span>
                          <span className="text-sm text-muted-foreground">Extract from databases, transform JSON structures, and load into external APIs.</span>
                       </div>
                    </li>
                    <li className="flex items-start gap-3">
                       <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5" />
                       <div>
                          <span className="font-medium text-foreground block">Webhook Orchestration</span>
                          <span className="text-sm text-muted-foreground">Catch incoming Stripe or GitHub webhooks and trigger complex internal workflows.</span>
                       </div>
                    </li>
                    <li className="flex items-start gap-3">
                       <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5" />
                       <div>
                          <span className="font-medium text-foreground block">Cron Jobs</span>
                          <span className="text-sm text-muted-foreground">Schedule periodic data syncs between third-party SaaS platforms and your database.</span>
                       </div>
                    </li>
                 </ul>
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="rounded-xl border border-border bg-panel p-6 shadow-sm font-mono text-xs md:text-sm text-muted-foreground overflow-x-auto">
                    <pre><code>{`{
  "id": "wf_01H8Z3",
  "name": "User Onboarding Sync",
  "nodes": [
    {
      "type": "webhook",
      "id": "node_trigger",
      "config": { "method": "POST" }
    },
    {
      "type": "transform",
      "id": "node_map",
      "dependsOn": ["node_trigger"]
    }
  ]
}`}</code></pre>
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/50 bg-background relative z-10">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col md:flex-row items-center justify-between px-8 py-8 gap-6">
          <div className="flex items-center gap-4">
            <BrandLogo compact={true} />
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              © {new Date().getFullYear()} NodeFlux.
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/shreyanshtripathi-01/NodeFlux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
