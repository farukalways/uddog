"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    setError("");
    toast.success("Thanks for subscribing. Watch your inbox for upcoming events.");
    e.currentTarget.reset();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="hero-pattern relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-content sm:px-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/30 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/30 blur-2xl" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Never miss a good deed
          </h2>
          <p className="mt-3 opacity-90">
            Get a short weekly note with the upcoming events in your area. No spam, ever.
          </p>
          <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 text-left">
              <input
                name="email"
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="input w-full bg-base-100 text-base-content"
              />
              {error && <span className="mt-1 block text-sm text-primary-content">{error}</span>}
            </div>
            <button type="submit" className="btn btn-secondary">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
