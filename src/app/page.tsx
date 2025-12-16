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
    <div style={{
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      padding: '0 20px',
      textAlign: 'center',
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #0a0a0a 70%)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 10 }}>
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#e5e5e5',
          margin: 0,
          lineHeight: 1.1
        }}>
          NodeFlux
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#737373',
          maxWidth: 600,
          margin: 0,
          lineHeight: 1.5
        }}>
          Visual workflow automation for developers. Build, test, and run complex API pipelines visually.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, zIndex: 10 }}>
        <Link
          href="/login"
          style={{
            backgroundColor: '#141414',
            color: '#e5e5e5',
            padding: '12px 24px',
            borderRadius: 8,
            border: '1px solid #262626',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 150ms ease',
          }}
        >
          Sign In
        </Link>
        <Link
          href="/register"
          style={{
            backgroundColor: '#22c55e',
            color: '#0a0a0a',
            padding: '12px 24px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 0 20px rgba(34,197,94,0.2)',
            transition: 'all 150ms ease',
          }}
        >
          Get Started
        </Link>
      </div>

      {/* Decorative Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
