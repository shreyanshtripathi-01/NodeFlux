import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { t } from '@/components/global/t';
import BrandLogo from '@/components/BrandLogo';
import HeroFlowGraphic from '@/components/HeroFlowGraphic';
import FeatureCard from '@/components/FeatureCard';

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
          <BrandLogo />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="px-3 py-2 text-muted-foreground">{t('Log In')}</Link>
            <Link href="/register" className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground">{t('Get Started')}</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-24 px-12 pb-16 pt-20">
        <div className="grid grid-cols-2 items-center gap-12">
          <div className="flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>{t('Composable workflows for API-first teams')}</span>
            </div>
            <div className="space-y-6">
              <h1 className="max-w-[620px] font-headings text-4xl font-semibold leading-[1.02] tracking-tight text-foreground">
                {t('Visual API Workflows for Developers')}
              </h1>
              <p className="max-w-[560px] text-lg leading-8 text-muted-foreground">
                {t('Chain APIs, webhooks, and AI models in a focused visual builder that feels more like an engineering tool than a drag-and-drop toy.')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/register" className="rounded-lg bg-primary px-6 py-4 font-medium text-primary-foreground">{t('Start Building for Free')}</Link>
              <Link href="#" className="rounded-lg border border-border bg-panel px-6 py-4 font-medium text-panel-foreground">{t('View Documentation')}</Link>
            </div>
            <div className="flex items-center gap-8 pt-3 text-sm text-muted-foreground">
              <span>{t('Used for internal tooling')}</span>
              <span>{t('Fast AI orchestration')}</span>
              <span>{t('Deploy from workflow to endpoint')}</span>
            </div>
          </div>
          <HeroFlowGraphic />
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
          <div className="grid grid-cols-3 gap-6">
            <FeatureCard icon="waypoints" title={t('Visual Node Builder')} description={t('Compose branching logic, HTTP calls, webhooks, and data transforms on a clean graph canvas.')} emphasized={true} />
            <FeatureCard icon="brain" title={t('AI Integration')} description={t('Drop model nodes into any chain, combine prompts with APIs, and route outputs into downstream steps.')} />
            <FeatureCard icon="rocket" title={t('Instant Deployment')} description={t('Turn finished workflows into production-ready endpoints and scheduled jobs without leaving the workspace.')} />
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-border px-12 py-6">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between text-sm text-muted-foreground">
          <span>{t('© 2026 NodeFlux')}</span>
          <div className="flex items-center gap-6">
            <Link href="#">{t('Github')}</Link>
            <Link href="#">{t('Twitter')}</Link>
            <Link href="#">{t('Docs')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
