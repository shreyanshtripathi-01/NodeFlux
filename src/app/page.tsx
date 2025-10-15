import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/workflows')
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          NodeFlux
        </h1>
        <p className="text-xl text-text-secondary max-w-[600px]">
          Visual workflow automation for developers. Build, test, and run complex API pipelines visually.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-surface hover:bg-surface-elevated text-text-primary px-6 py-3 rounded-md border border-border font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="bg-accent-trigger hover:bg-green-600 text-[#0a0a0a] px-6 py-3 rounded-md font-medium transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
