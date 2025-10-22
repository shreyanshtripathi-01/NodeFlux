"use server";

import { createClient } from "@/utils/supabase/server";

export interface LoginState {
  error?: string;
  success?: boolean;
}

export interface RegisterState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function login(
  _state: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signup(
  _state: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: formData.get("name") as string || email.split("@")[0] },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Check your email to confirm your account!" };
}

export async function forgotPassword(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const origin = formData.get("origin") as string;

  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function verifyOtpAction(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  if (!email || !token) return { error: "Email and token are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProfile(
  _state: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = formData.get("name") as string;

  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { name },
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}