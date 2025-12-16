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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '40px', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e5e5e5', margin: 0 }}>Your Workflows</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#737373', fontSize: 14 }}>{user.email}</span>
          <form action="/auth/signout" method="post" style={{ margin: 0 }}>
            <button style={{
              backgroundColor: '#141414',
              color: '#e5e5e5',
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #262626',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}>
              Sign out
            </button>
          </form>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#141414',
        border: '1px dashed #404040',
        borderRadius: 12,
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <p style={{ color: '#737373', marginBottom: 24, fontSize: 15 }}>No workflows found. Create your first automation pipeline.</p>
        <Link 
          href="/editor/new"
          style={{
            backgroundColor: '#22c55e',
            color: '#0a0a0a',
            padding: '10px 20px',
            borderRadius: 6,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background-color 150ms ease'
          }}
        >
          Create Workflow
        </Link>
      </div>
    </div>
  )
}
