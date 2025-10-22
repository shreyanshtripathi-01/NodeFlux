"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { login, type LoginState } from "@/app/auth/actions";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";

const initialState: LoginState = {};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (state?.success) {
      router.push("/workflows");
      router.refresh();
    }
  }, [state?.success, router]);

  const validateForm = (form: HTMLFormElement) => {
    const email = form.email.value.trim();
    const password = form.password.value;
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateForm(e.currentTarget)) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-custom dot-grid relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary-text transition-colors z-10"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="w-full max-w-[380px] flex flex-col gap-8"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <Logo />
          <h2 className="font-display font-semibold text-[28px] tracking-tight text-primary-text">Sign in</h2>
          <p className="text-[15px] text-secondary-text">Access your workflows and dashboard</p>
        </div>

        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {state?.error && (
            <div className="border border-error-custom/25 bg-error-soft text-error-custom p-3 text-xs rounded-custom-md font-sans">
              {state.error}
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
                onChange={() => setEmailError("")}
                className={`w-full border pl-9 pr-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text ${
                  emailError ? "border-error-custom" : "border-border-custom"
                }`}
                placeholder="Email address"
              />
            </div>
            {emailError && (
              <span className="text-[11px] text-error-custom font-medium">{emailError}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="font-semibold text-[13px] text-secondary-text font-sans">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-secondary-text hover:text-primary-text transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={() => setPasswordError("")}
                className={`w-full border pl-9 pr-10 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text ${
                  passwordError ? "border-error-custom" : "border-border-custom"
                }`}
                placeholder="Password"
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
            {passwordError && (
              <span className="text-[11px] text-error-custom font-medium">{passwordError}</span>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 rounded border-border-custom text-foreground focus:ring-0 bg-background"
            />
            <span className="text-[13px] text-secondary-text font-medium">Remember me</span>
          </label>

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
              "Sign in"
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <span className="flex-1 h-px bg-border-custom" />
            <span className="text-xs text-muted-text font-medium">or</span>
            <span className="flex-1 h-px bg-border-custom" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              className="w-full border border-border-custom hover:bg-surface-hover text-primary-text py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer opacity-50"
              disabled
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full border border-border-custom hover:bg-surface-hover text-primary-text py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer opacity-50"
              disabled
            >
              Continue with GitHub
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-secondary-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold hover:underline text-foreground">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}