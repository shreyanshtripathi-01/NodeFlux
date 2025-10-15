import React from "react";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display font-extrabold text-2xl tracking-[-0.02em] text-primary-text select-none ${className}`}
      aria-label="NodeFlux Home"
    >
      /nodeflux.
    </Link>
  );
}