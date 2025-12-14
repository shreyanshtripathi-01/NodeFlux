"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans px-6">
      <h1 className="font-mono font-bold text-[64px] leading-none text-primary-text">500</h1>
      <p className="font-mono text-sm text-secondary-text mt-4 mb-8 text-center max-w-[400px]">
        Something went wrong processing your request.
      </p>
      <button
        onClick={reset}
        className="bg-foreground text-background text-sm font-semibold rounded-md py-2 px-5 hover:opacity-90 transition-all font-mono"
      >
        Try again
      </button>
    </div>
  );
}
