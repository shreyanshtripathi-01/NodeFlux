import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function WorkflowsDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex-1 flex flex-col w-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your Workflows</h1>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-sm">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="bg-surface hover:bg-surface-elevated px-4 py-2 rounded border border-border text-sm transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>
      
      <div className="bg-surface border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
        <p className="text-text-secondary mb-4">No workflows found. Create your first automation pipeline.</p>
        <Link 
          href="/editor/new"
          className="bg-accent-trigger text-[#0a0a0a] px-4 py-2 rounded font-medium hover:bg-green-600 transition-colors"
        >
          Create Workflow
        </Link>
      </div>
    </div>
  )
}
