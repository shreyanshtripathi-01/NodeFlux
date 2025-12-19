import Link from 'next/link';
import { login } from './actions';
import Icon from '@/components/global/Icon';
import BrandLogo from '@/components/BrandLogo';
import { t } from '@/components/global/t';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  
  return (
    <div className="nodeflux-auth-grid flex min-h-screen flex-col bg-background px-12 py-8 text-foreground">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-4 py-3 text-sm text-muted-foreground hover:bg-elevated transition-colors">
          <Icon i="arrow-left" size={16} />
          {t('Back to Home')}
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[460px] flex-col gap-8 rounded-xl border border-border bg-panel px-10 py-10 shadow-2xl shadow-background">
          <div className="flex flex-col gap-6">
            <BrandLogo compact={false} />
            <div className="space-y-2">
              <h1 className="font-headings text-2xl font-semibold tracking-tight text-panel-foreground">{t('Welcome back')}</h1>
              <p className="text-sm text-muted-foreground">{t('Log in to your account')}</p>
            </div>
          </div>
          
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-secondary-foreground">{t('Email')}</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@company.com" 
                required 
                className="flex items-center justify-between rounded-lg border border-border bg-input px-4 min-h-12 py-3 text-sm text-panel-foreground placeholder:text-muted-foreground focus:border-accent focus:bg-elevated focus:outline-none transition-colors w-full"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-secondary-foreground">{t('Password')}</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••••••" 
                required 
                className="flex items-center justify-between rounded-lg border border-border bg-input px-4 min-h-12 py-3 text-sm text-panel-foreground placeholder:text-muted-foreground focus:border-accent focus:bg-elevated focus:outline-none transition-colors w-full"
              />
            </div>
            
            <button formAction={login} className="flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity mt-2 w-full">
              {t('Sign In')}
            </button>
            
            {message && (
              <p className="p-3 bg-danger/10 text-danger border border-danger/20 text-center text-sm rounded-lg">
                {message}
              </p>
            )}
          </form>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("Don't have an account?")}</span>
            <Link href="/register" className="text-foreground hover:underline">{t('Sign up')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
