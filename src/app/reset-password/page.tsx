"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Lock, Eye, EyeOff, Check } from "lucide-react";

function getPasswordStrength(password: string): { label: string; width: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", width: "33%", color: "bg-error-custom" };
  if (score <= 3) return { label: "Medium", width: "66%", color: "bg-secondary-text" };
  return { label: "Strong", width: "100%", color: "bg-foreground" };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsReady(true);
      } else {
        setError("Invalid or expired reset link. Please request a new one.");
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setIsPending(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsPending(false);
    } else {
      setIsDone(true);
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    }
  };

  const strength = getPasswordStrength(password);

  if (!isReady && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-custom dot-grid">
        <p className="text-sm text-secondary-text">Checking reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-custom dot-grid relative">
      {!isDone && (
        <Link
          href="/login"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary-text transition-colors z-10"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back to login
        </Link>
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="w-full max-w-[380px] flex flex-col gap-8"
      >
        {isDone ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center"
            >
              <Check size={32} strokeWidth={3} className="text-background" />
            </motion.div>
            <h2 className="font-display font-semibold text-2xl text-primary-text">Password updated!</h2>
            <p className="text-sm text-secondary-text">Redirecting to login...</p>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-2">
              <Logo />
              <h2 className="font-display font-semibold text-[28px] tracking-tight text-primary-text">Reset password</h2>
              <p className="text-[15px] text-secondary-text">Enter your new password</p>
            </div>

            {error && (
              <div className="border border-error-custom/25 bg-error-soft text-error-custom p-3 text-xs rounded-custom-md font-sans text-center">
                {error}
              </div>
            )}

            {!isReady ? null : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="font-semibold text-[13px] text-secondary-text font-sans">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full border pl-9 pr-10 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text border-border-custom"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-secondary-text transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="w-full h-1 rounded-full bg-border-custom overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-text font-medium uppercase tracking-wider">{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm" className="font-semibold text-[13px] text-secondary-text font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                      className="w-full border pl-9 pr-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text border-border-custom"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-foreground text-background py-3 text-sm font-semibold rounded-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-subtle disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : (
                    "Reset password"
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}