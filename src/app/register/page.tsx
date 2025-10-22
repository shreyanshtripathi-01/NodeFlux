"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/Logo";
import { signup } from "@/app/auth/actions";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Check, User } from "lucide-react";

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

const requirements = [
  { label: "6+ characters", test: (pw: string) => pw.length >= 6 },
  { label: "Uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "Special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const stepVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const validateEmail = () => {
    if (!emailValue) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!passwordValue) {
      setPasswordError("Password is required");
      return false;
    }
    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleContinue = () => {
    if (validateEmail()) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signup(null, formData);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else if (result.success) {
      router.push(`/verify-email?email=${encodeURIComponent(emailValue)}`);
      router.refresh();
    }
  };

  const strength = getPasswordStrength(passwordValue);

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
          <h2 className="font-display font-semibold text-[28px] tracking-tight text-primary-text">Create your account</h2>
          <p className="text-[15px] text-secondary-text">Start building workflows visually</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-colors ${step >= 0 ? "bg-foreground" : "bg-border-custom"}`} />
          <span className="w-6 h-px bg-border-custom" />
          <span className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? "bg-foreground" : "bg-border-custom"}`} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0 — Email */}
          {step === 0 && (
            <motion.div
              key="step-email"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" as const }}
              className="flex flex-col gap-5"
            >
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
                    value={emailValue}
                    onChange={(e) => { setEmailValue(e.target.value); setEmailError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
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
                <label htmlFor="name" className="font-semibold text-[13px] text-secondary-text font-sans">
                  Name <span className="text-muted-text font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <User size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full border pl-9 pr-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-all placeholder:text-muted-text border-border-custom"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-foreground text-background py-3 text-sm font-semibold rounded-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-subtle"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 1 — Password */}
          {step === 1 && (
            <motion.div
              key="step-password"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" as const }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <input type="hidden" name="email" value={emailValue} />
                <input type="hidden" name="name" value={nameValue} />
                {error && (
                  <div className="border border-error-custom/25 bg-error-soft text-error-custom p-3 text-xs rounded-custom-md font-sans">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="font-semibold text-[13px] text-secondary-text font-sans">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      value={passwordValue}
                      onChange={(e) => { setPasswordValue(e.target.value); setPasswordError(""); }}
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

                  {/* Strength bar */}
                  {passwordValue && !passwordError && (
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

                {/* Requirements checklist */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Requirements</span>
                  {requirements.map((req, i) => {
                    const met = req.test(passwordValue);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${met ? "bg-foreground" : "bg-border-custom"}`}>
                          {met && <Check size={10} strokeWidth={3} className="text-background" />}
                        </span>
                        <span className={`text-xs transition-colors ${met ? "text-primary-text" : "text-muted-text"}`}>{req.label}</span>
                      </div>
                    );
                  })}
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
                    "Create account"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 0 && (
          <div className="text-center text-xs text-secondary-text">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline text-foreground">
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}