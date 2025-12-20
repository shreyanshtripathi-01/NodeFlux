import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { t } from '@/components/global/t';
import BrandLogo from '@/components/BrandLogo';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/workflows');
  }

  return (
    <div className="flex min-h-[1200px] flex-col bg-background text-foreground">
      <div className="border-b border-border px-12 py-5">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">{t('Log In')}</Link>
            <Link href="/register" className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity">{t('Get Started')}</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-24 px-12 pb-16 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>{t('Composable workflows for API-first teams')}</span>
            </div>
            <div className="space-y-6">
              <h1 className="max-w-[620px] font-headings text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
                {t('Visual API Workflows for Developers')}
              </h1>
              <p className="max-w-[560px] text-lg leading-8 text-muted-foreground">
                {t('Chain APIs, webhooks, and AI models in a focused visual builder that feels more like an engineering tool than a drag-and-drop toy.')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/register" className="rounded-lg bg-primary px-6 py-4 font-medium text-primary-foreground hover:opacity-90 transition-opacity">{t('Start Building for Free')}</Link>
              <Link href="#" className="rounded-lg border border-border bg-panel px-6 py-4 font-medium text-panel-foreground hover:bg-elevated transition-colors">{t('View Documentation')}</Link>
            </div>
            <div className="flex items-center gap-8 pt-3 text-sm text-muted-foreground">
              <span>{t('Used for internal tooling')}</span>
              <span>{t('Fast AI orchestration')}</span>
              <span>{t('Deploy from workflow to endpoint')}</span>
            </div>
          </div>
          <div className="hidden lg:flex justify-end items-center">
            {/* Minimalist Graphic Placeholder replacing HeroFlowGraphic */}
            <div className="relative w-full max-w-[500px] aspect-square rounded-2xl border border-border bg-panel/50 flex items-center justify-center p-8 overflow-hidden">
               <div className="absolute inset-0 nodeflux-grid opacity-30"></div>
               <div className="relative flex flex-col gap-4 w-full">
                  <div className="w-full h-16 rounded-xl border border-border bg-background shadow-lg flex items-center px-4 gap-3">
                     <div className="w-8 h-8 rounded bg-success/20 flex items-center justify-center text-success text-xs font-mono">GET</div>
                     <div className="h-2 w-32 bg-muted rounded"></div>
                  </div>
                  <div className="flex justify-center my-2">
                     <div className="w-[1px] h-8 bg-border"></div>
                  </div>
                  <div className="w-full h-16 rounded-xl border border-border bg-elevated shadow-lg flex items-center px-4 gap-3">
                     <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">AI</div>
                     <div className="h-2 w-48 bg-muted rounded"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-border pt-16">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t('Built for technical teams')}</p>
              <h2 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
                {t('Everything you need to design, test, and ship intelligent workflows')}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground">{t('Minimal shell, IDE-grade internals')}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Replacing FeatureCard usages with simple semantic HTML */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-panel p-6 shadow-sm">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border text-foreground">
                  <span className="material-symbols-outlined text-[20px]">waypoints</span>
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">{t('Visual Node Builder')}</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">{t('Compose branching logic, HTTP calls, webhooks, and data transforms on a clean graph canvas.')}</p>
            </div>
            
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-panel p-6 shadow-sm">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border text-foreground">
                  <span className="material-symbols-outlined text-[20px]">brain</span>
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">{t('AI Integration')}</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">{t('Drop model nodes into any chain, combine prompts with APIs, and route outputs into downstream steps.')}</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-panel p-6 shadow-sm">
               <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border text-foreground">
                  <span className="material-symbols-outlined text-[20px]">rocket</span>
               </div>
               <h3 className="font-headings text-lg font-medium text-foreground">{t('Instant Deployment')}</h3>
               <p className="text-sm leading-relaxed text-muted-foreground">{t('Turn finished workflows into production-ready endpoints and scheduled jobs without leaving the workspace.')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-border px-12 py-6">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between text-sm text-muted-foreground">
          <span>{t('© 2026 NodeFlux')}</span>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">{t('Github')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('Twitter')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('Docs')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
