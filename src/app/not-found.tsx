import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <span className="font-mono text-[8rem] leading-none text-primary-text font-bold tracking-tighter">
        404
      </span>
      <p className="mt-4 text-base text-secondary-text font-mono">
        this page doesn&apos;t exist
      </p>
      <Link
        href="/workflows"
        className="mt-8 inline-flex items-center gap-2 px-4 py-2 border border-primary-text text-sm font-medium hover:bg-primary-text hover:text-background transition-colors"
      >
        back to workflows
      </Link>
    </main>
  );
}
