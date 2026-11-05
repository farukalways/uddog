"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email address.";
    if (!password) next.password = "Please enter your password.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Incorrect email or password.");
      return;
    }
    toast.success("Welcome back! You are now logged in.");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <div>
          <h1 className="section-title">Welcome back</h1>
          <p className="mt-1 text-sm opacity-70">Log in to create, join and manage events.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`} />
            {errors.email && <span className="mt-1 block text-sm text-error">{errors.email}</span>}
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Password</span>
            <input name="password" type="password" autoComplete="current-password" placeholder="Your password" className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`} />
            {errors.password && <span className="mt-1 block text-sm text-error">{errors.password}</span>}
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading && <span className="loading loading-spinner loading-sm" />}
            Login
          </button>
        </form>

        <div className="divider my-0">or</div>
        <GoogleButton redirectTo={redirectTo} />

        <p className="text-center text-sm">
          New to Uddog?{" "}
          <Link href="/register" className="link link-primary font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
