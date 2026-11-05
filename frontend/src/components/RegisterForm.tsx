"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

type Errors = { name?: string; email?: string; photoURL?: string; password?: string };

function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const photoURL = String(form.get("photoURL") || "").trim();
    const password = String(form.get("password") || "");

    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your full name.";
    if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email address.";
    if (!isUrl(photoURL)) next.photoURL = "Please enter a valid photo URL starting with http or https.";
    if (password.length < 6) next.password = "Password must be at least 6 characters long.";
    else if (!/[A-Z]/.test(password)) next.password = "Password must include an uppercase letter.";
    else if (!/[a-z]/.test(password)) next.password = "Password must include a lowercase letter.";
    else if (!PASSWORD_RE.test(password)) next.password = "Password does not meet the requirements.";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({ name, email, password, image: photoURL });
    setLoading(false);

    if (error) {
      toast.error(error.message || "We could not create your account. Please try again.");
      return;
    }
    toast.success("Account created! Welcome to Uddog.");
    router.push("/");
    router.refresh();
  }

  const field = (key: keyof Errors) => `input input-bordered w-full ${errors[key] ? "input-error" : ""}`;

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <div>
          <h1 className="section-title">Join your neighbours</h1>
          <p className="mt-1 text-sm opacity-70">Create an account to start organising community events.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Your full name" className={field("name")} />
            {errors.name && <span className="mt-1 block text-sm text-error">{errors.name}</span>}
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={field("email")} />
            {errors.email && <span className="mt-1 block text-sm text-error">{errors.email}</span>}
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Photo URL</span>
            <input name="photoURL" type="url" placeholder="https://example.com/your-photo.jpg" className={field("photoURL")} />
            {errors.photoURL && <span className="mt-1 block text-sm text-error">{errors.photoURL}</span>}
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">Password</span>
            <input name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" className={field("password")} />
            {errors.password ? (
              <span className="mt-1 block text-sm text-error">{errors.password}</span>
            ) : (
              <span className="mt-1 block text-xs opacity-60">Use an uppercase letter, a lowercase letter and at least 6 characters.</span>
            )}
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading && <span className="loading loading-spinner loading-sm" />}
            Register
          </button>
        </form>

        <div className="divider my-0">or</div>
        <GoogleButton />

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
