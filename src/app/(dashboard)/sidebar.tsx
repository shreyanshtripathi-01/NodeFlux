"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { signout } from "@/app/auth/actions";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/workflows", label: "Workflows" },
  { href: "/runs", label: "Runs" },
  { href: "/settings", label: "Settings" },
];

export function DashboardSidebar({ userEmail, userName }: { userEmail: string; userName?: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-full bg-background border-r border-border-custom flex flex-col z-40">
      <div className="p-4 border-b border-border-custom">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-secondary-text hover:bg-surface-hover hover:text-primary-text"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-custom">
        <div className="px-3 pt-3 pb-2">
          <div className="px-4 pb-2 border-b border-border-custom mb-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between text-[13px] font-semibold text-secondary-text hover:text-primary-text transition-colors py-1.5"
            >
              <span>Appearance</span>
              <span className="text-base leading-none">{theme === "light" ? "☀" : "☾"}</span>
            </button>
          </div>
          <div className="px-4 flex flex-col">
            <span className="text-sm font-semibold text-primary-text truncate" title={userName || userEmail}>
              {userName || userEmail.split("@")[0]}
            </span>
            {userName && (
              <span className="text-[11px] text-muted-text truncate">{userEmail}</span>
            )}
          </div>
        </div>
        <div className="px-3 pb-3">
          <form action={signout}>
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-[15px] font-semibold text-error-custom hover:bg-error-soft rounded-md transition-colors text-left"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}