"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { forgotPassword } from "@/app/auth/actions";
import { ArrowLeft, Mail, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setIsPending(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("origin", window.location.origin);

    const result = await forgotPassword(null, formData);
    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setSent(true);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-custom dot-grid relative">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary-text transition-colors z-10"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to login
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="w-full max-w-[380px] flex flex-col gap-8"
      >
        {sent ? (
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
            <h2 className="font-display font-semibold text-2xl text-primary-text">Check your email</h2>
            <p className="text-sm text-secondary-text leading-relaxed">
              We sent a password reset link to<br />
              <span className="font-semibold text-primary-text">{email}</span>
            </p>
            <Link
              href="/login"
              className="text-sm font-semibold text-foreground hover:underline mt-2"
            >
              Back to login
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-2">
              <Logo />
              <h2 className="font-display font-semibold text-[28px] tracking-tight text-primary-text">Forgot password</h2>
              <p className="text-[15px] text-secondary-text">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="border border-error-custom/25 bg-error-soft text-error-custom p-3 text-xs rounded-custom-md font-sans">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-semibold text-[13px] text-secondary-text font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full border pl-9 pr-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text border-border-custom"
                    placeholder="Email address"
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
                  "Send reset link"
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}