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
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-6 text-sm font-medium">
            <ThemeToggle />
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('Log In')}
            </Link>
            <Link href="/register" className="group flex items-center gap-1.5 rounded-md bg-foreground text-background px-4 py-2 transition-transform hover:-translate-y-[1px] active:translate-y-0">
              {t('Get Started')} <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-col">
        {/* HERO SECTION */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col lg:flex-row items-center gap-12 px-6 pb-20 pt-16 lg:pt-20">
          
          <div className="flex flex-col gap-6 w-full lg:w-1/2 relative z-20">
            <div className="space-y-4">
              <h1 className="font-headings text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-tight text-foreground">
                {t('Visual API Workflows.')}<br/>
                <span className="text-muted-foreground">{t('For Developers.')}</span>
              </h1>
              <p className="max-w-[500px] text-lg leading-relaxed text-muted-foreground">
                {t('Chain APIs, webhooks, and logic gates in a visual builder. Execute your backend logic without writing boilerplate glue code.')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register" className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90">
                {t('Start Building')}
              </Link>
              <Link href="#" className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-panel">
                {t('Documentation')}
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            {/* Simple Flat Workflow Diagram */}
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-xl border border-border bg-panel/30 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 nodeflux-grid opacity-50" />
               
               {/* SVG Connecting Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none text-border" style={{ zIndex: 0 }}>
                  <path d="M 140 120 C 180 120, 200 180, 240 180" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 240 180 C 280 180, 300 120, 340 120" fill="none" stroke="currentColor" strokeWidth="2" />
               </svg>
               
               {/* Node 1 */}
               <div className="absolute top-[100px] left-[40px] z-10 w-48 rounded-lg border border-border bg-background p-3 shadow-sm hover:border-muted-foreground transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-success" />
                     <span className="text-xs font-semibold">Webhook Target</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full" />
               </div>

               {/* Node 2 */}
               <div className="absolute top-[160px] left-[140px] z-10 w-48 rounded-lg border border-border bg-background p-3 shadow-sm hover:border-muted-foreground transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-foreground" />
                     <span className="text-xs font-semibold">Data Transform</span>
                  </div>
                  <div className="h-2 w-3/4 bg-muted rounded-full" />
               </div>

               {/* Node 3 */}
               <div className="absolute top-[100px] right-[40px] z-10 w-48 rounded-lg border border-border bg-background p-3 shadow-sm hover:border-muted-foreground transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500" />
                     <span className="text-xs font-semibold">HTTP Request</span>
                  </div>
                  <div className="h-2 w-5/6 bg-muted rounded-full" />
               </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="border-t border-border/50 bg-panel/30">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-6 py-20">
            <div className="space-y-2 max-w-[600px]">
              <h2 className="font-headings text-2xl font-bold tracking-tight text-foreground">
                Engineered for Backend Logic
              </h2>
              <p className="text-muted-foreground">
                NodeFlux handles the tedious parts of API orchestration. Build robust pipelines with primitive blocks designed for developers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6 hover:shadow-md transition-shadow">
                 <h3 className="font-headings text-lg font-semibold text-foreground">{t('Directed Acyclic Graphs')}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">{t('Workflows execute strictly as DAGs. Dependencies are resolved automatically, and infinite loops are caught statically.')}</p>
              </div>
              
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6 hover:shadow-md transition-shadow">
                 <h3 className="font-headings text-lg font-semibold text-foreground">{t('Type Validation')}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">{t('Payloads passing between nodes are schema-validated. Catch mismatch errors in the canvas, not in production.')}</p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6 hover:shadow-md transition-shadow">
                 <h3 className="font-headings text-lg font-semibold text-foreground">{t('Edge Deployment')}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">{t('Once compiled, your workflows run as serverless edge functions with near-zero cold starts and horizontal scaling.')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATIONS & CAPABILITIES */}
        <section className="mx-auto flex w-full max-w-[1240px] flex-col lg:flex-row items-center gap-12 px-6 py-20 border-t border-border/50">
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="font-headings text-3xl font-bold tracking-tight text-foreground">
              Connect Anything with an API
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We provide raw, unopinionated HTTP client nodes and incoming webhook triggers. If a service has a REST or GraphQL API, you can orchestrate it in NodeFlux. No waiting for official integration plugins.
            </p>
            <ul className="space-y-2 pt-4">
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" /> Fetch & Post JSON Payloads
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" /> Parse & Map Array Data
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" /> Basic Auth & Bearer Tokens
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
               <div className="p-4 rounded-lg border border-border bg-panel text-center text-sm font-medium hover:bg-border/50 transition-colors">Postgres</div>
               <div className="p-4 rounded-lg border border-border bg-panel text-center text-sm font-medium hover:bg-border/50 transition-colors">Stripe APIs</div>
               <div className="p-4 rounded-lg border border-border bg-panel text-center text-sm font-medium hover:bg-border/50 transition-colors">Custom Webhooks</div>
               <div className="p-4 rounded-lg border border-border bg-panel text-center text-sm font-medium hover:bg-border/50 transition-colors">Slack/Discord</div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/50 bg-background relative z-10">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2">
            <BrandLogo compact={true} />
            <span className="text-sm font-medium text-muted-foreground ml-2">
              © {new Date().getFullYear()} NodeFlux
            </span>
          </div>
          
          <div className="flex items-center gap-6">
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
