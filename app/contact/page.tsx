import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Free QR Code Maker",
  description:
    "Have a question, suggestion, or found a bug? Get in touch with the Free QR Code Maker team.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/contact",
  },
  robots: { index: false },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: "#06b6d4" }}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to QR Generator
      </Link>

      <div
        className="rounded-2xl p-8"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <h1 className="gradient-text mb-2 text-3xl font-extrabold">Get in Touch</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Have a question, suggestion, or found a bug? We&apos;d love to hear from you.
        </p>

        {/* Direct email card */}
        <div
          className="mb-8 flex items-start gap-4 rounded-xl p-5"
          style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}
        >
          <div
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(6,182,212,0.12)" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth={2} aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <p className="mb-0.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Email us directly
            </p>
            <a
              href="mailto:ovaisbhat185@gmail.com"
              className="text-sm font-medium underline underline-offset-2"
              style={{ color: "#06b6d4" }}
            >
              ovaisbhat185@gmail.com
            </a>
            <p className="mt-1 text-xs" style={{ color: "var(--text-hint)" }}>
              We typically respond within 24–48 hours.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
