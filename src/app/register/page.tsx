import Link from 'next/link'
import { signup } from './actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 400,
      margin: '0 auto',
      padding: '80px 20px',
      justifyContent: 'center',
    }}>
      <Link
        href="/"
        style={{
          position: 'absolute',
          left: 32,
          top: 32,
          padding: '8px 16px',
          borderRadius: 6,
          textDecoration: 'none',
          color: '#737373',
          backgroundColor: '#141414',
          border: '1px solid #262626',
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1c1c1c';
          e.currentTarget.style.color = '#e5e5e5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#141414';
          e.currentTarget.style.color = '#737373';
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 8, height: 16, width: 16 }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <form style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#141414',
        padding: 32,
        borderRadius: 12,
        border: '1px solid #262626',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e5e5e5', margin: '0 0 8px 0' }}>Create an account</h1>
          <p style={{ color: '#737373', fontSize: 14, margin: 0 }}>Sign up for NodeFlux to start building workflows.</p>
        </div>

        <label style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#737373', marginBottom: 4 }} htmlFor="email">
          Email
        </label>
        <input
          name="email"
          placeholder="you@example.com"
          required
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: 6,
            padding: '10px 16px',
            marginBottom: 16,
            color: '#e5e5e5',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
        />
        
        <label style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#737373', marginBottom: 4 }} htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: 6,
            padding: '10px 16px',
            marginBottom: 24,
            color: '#e5e5e5',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
        />
        
        <button
          formAction={signup}
          style={{
            backgroundColor: '#22c55e',
            color: '#0a0a0a',
            fontWeight: 500,
            borderRadius: 6,
            padding: '10px 16px',
            marginBottom: 16,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            fontSize: 14,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
        >
          Sign Up
        </button>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#737373', fontSize: 14 }}>Already have an account? </span>
          <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            Sign in
          </Link>
        </div>

        {message && (
          <p style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#1c1c1c',
            color: '#f43f5e',
            border: '1px solid rgba(244,63,94,0.3)',
            textAlign: 'center',
            fontSize: 14,
            borderRadius: 6,
            margin: '24px 0 0 0',
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
