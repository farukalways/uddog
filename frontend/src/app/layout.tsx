import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Uddog | Community Service Events",
    template: "%s | Uddog",
  },
  description:
    "Create, join and track social service events in your neighbourhood, from winter clothes drives to tree plantations.",
};

// Runs before paint so the saved theme is applied without a flash
const themeScript = `
try {
  var t = localStorage.getItem("theme");
  if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Uddog-dark" : "Uddog";
  document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="Uddog"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content"  cz-shortcut-listen="true">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{ duration: 3500, style: { borderRadius: "0.75rem" } }}
        />
      </body>
    </html>
  );
}
