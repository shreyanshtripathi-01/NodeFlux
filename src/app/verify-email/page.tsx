"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/utils/supabase/client";
import { verifyOtpAction } from "@/app/auth/actions";
import { ArrowLeft, Check } from "lucide-react";

const OTP_LENGTH = 8;
const RESEND_COOLDOWN = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const supabase = createClient();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const focusNext = useCallback((index: number) => {
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const focusPrev = useCallback((index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    setError("");
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value) focusNext(index);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index]) {
      focusPrev(index);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const next = [...otp];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    const focusTo = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[focusTo]?.focus();
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code`);
      return;
    }
    setIsVerifying(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", token);

    const result = await verifyOtpAction(null, formData);

    if (result.error) {
      setError(result.error);
      setIsVerifying(false);
      return;
    }

    setIsVerified(true);
    setTimeout(() => {
      window.location.href = "/workflows";
    }, 1500);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN);
    setError("");
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-custom dot-grid relative">
      <Link
        href="/register"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary-text transition-colors z-10"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="w-full max-w-[420px] flex flex-col gap-8"
      >
        {isVerified ? (
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
            <h2 className="font-display font-semibold text-2xl text-primary-text">Email verified!</h2>
            <p className="text-sm text-secondary-text">Redirecting to your dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-2">
              <Logo />
              <h2 className="font-display font-semibold text-[28px] tracking-tight text-primary-text">Check your email</h2>
              <p className="text-[15px] text-secondary-text leading-relaxed">
                We sent a verification code to<br />
                <span className="font-semibold text-primary-text">{email}</span>
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[13px] text-secondary-text font-sans text-center">
                  Verification code
                </label>
                <div className="flex items-center justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      className={`w-9 h-12 text-center text-lg font-semibold border rounded-md bg-background text-primary-text focus:outline-none focus:border-foreground transition-all ${
                        error ? "border-error-custom" : "border-border-custom"
                      }`}
                    />
                  ))}
                </div>
                {error && (
                  <span className="text-[11px] text-error-custom font-medium text-center">{error}</span>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-foreground text-background py-3 text-sm font-semibold rounded-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-subtle disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-background rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : (
                  "Verify email"
                )}
              </button>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-sm text-secondary-text hover:text-primary-text transition-colors disabled:text-muted-text cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive the code? Resend"}
                </button>
                <p className="text-[11px] text-muted-text">
                  Or click the confirmation link in the email
                </p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}