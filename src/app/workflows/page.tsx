import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/global/Icon';
import BrandLogo from '@/components/BrandLogo';
import { t } from '@/components/global/t';

export default async function WorkflowsDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r border-border bg-panel">
        <div className="flex items-center border-b border-border px-5 py-4">
          <BrandLogo compact={false} />
        </div>
        <div className="flex flex-col gap-1 p-3">
          <Link href="/editor/new" className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Icon i="plus" size={16} />
            {t('New Workflow')}
          </Link>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <Link href="/workflows" className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
            <Icon i="git-branch" size={16} />
            {t('Workflows')}
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground">
            <Icon i="database" size={16} />
            {t('Connections')}
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground">
            <Icon i="history" size={16} />
            {t('Execution Logs')}
          </Link>
        </div>
        <div className="mt-auto border-t border-border p-3">
          <form action="/auth/signout" method="post" className="m-0">
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground">
              <Icon i="log-out" size={16} />
              {t('Sign out')}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon i="git-branch" size={16} />
            <span>{t('Workflows')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
              {user.email?.[0].toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-background p-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h1 className="font-headings text-2xl font-semibold tracking-tight text-foreground">{t('Active Workflows')}</h1>
                <p className="text-sm text-muted-foreground">{t('Manage and monitor your data pipelines.')}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel p-12 text-center h-64">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon i="git-branch" size={24} />
              </div>
              <h3 className="mb-2 font-headings text-lg font-semibold text-foreground">{t('No Workflows Configured')}</h3>
              <p className="mb-6 max-w-sm text-sm leading-6 text-muted-foreground">
                {t('Your workspace is ready. Start by creating a new workflow to orchestrate your data pipelines.')}
              </p>
              <Link href="/editor/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                {t('Initialize Workspace')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
