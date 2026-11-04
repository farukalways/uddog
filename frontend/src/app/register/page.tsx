import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <section className="hero-pattern grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <RegisterForm />
    </section>
  );
}
