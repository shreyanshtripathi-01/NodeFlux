import Link from 'next/link'
import { signup } from './actions'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-text-secondary bg-surface hover:bg-surface-elevated flex items-center group text-sm border border-border"
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
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
          <p className="text-text-secondary text-sm">Sign up for NodeFlux to start building workflows.</p>
        </div>

        <label className="text-xs uppercase tracking-wide text-text-secondary mb-1" htmlFor="email">
          Email
        </label>
        <input
          className="bg-surface rounded-md px-4 py-2 mb-4 border border-border focus:border-accent-http focus:outline-none focus:ring-1 focus:ring-accent-http text-sm"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-xs uppercase tracking-wide text-text-secondary mb-1" htmlFor="password">
          Password
        </label>
        <input
          className="bg-surface rounded-md px-4 py-2 mb-6 border border-border focus:border-accent-http focus:outline-none focus:ring-1 focus:ring-accent-http text-sm"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={signup}
          className="bg-accent-trigger hover:bg-green-600 text-[#0a0a0a] font-medium rounded-md px-4 py-2 mb-2 transition-colors"
        >
          Sign Up
        </button>
        
        <div className="text-center mt-4">
          <span className="text-text-secondary text-sm">Already have an account? </span>
          <Link href="/login" className="text-accent-http hover:underline text-sm font-medium">
            Sign in
          </Link>
        </div>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-surface-elevated text-accent-output border border-accent-output/30 text-center text-sm rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
