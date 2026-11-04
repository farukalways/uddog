import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  // Only allow same-site relative redirects
  const redirectTo = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

  return (
    <section className="hero-pattern grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <LoginForm redirectTo={redirectTo} />
    </section>
  );
}
