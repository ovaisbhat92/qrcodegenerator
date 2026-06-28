import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Free QR Code Maker",
  description:
    "Terms and conditions for using freeqrcodemaker.in. The service is free, browser-based, and provided as-is.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/terms",
  },
  robots: { index: false },
};

export default function TermsPage() {
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
        <h1 className="gradient-text mb-1 text-3xl font-extrabold">Terms &amp; Conditions</h1>
        <p className="mb-8 text-sm" style={{ color: "var(--text-hint)" }}>Last updated: June 2026</p>

        <div className="space-y-7 leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Acceptance of terms
            </h2>
            <p>
              By using freeqrcodemaker.in you agree to these terms. If you don&apos;t agree,
              please don&apos;t use the site — though we think you&apos;ll find it pretty straightforward.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              The service is free and provided as-is
            </h2>
            <p>
              This QR code generator is provided free of charge. We make no guarantees about uptime,
              availability, or fitness for any particular purpose. We do our best to keep it running
              reliably, but we cannot promise it will always be available or error-free.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Your content, your responsibility
            </h2>
            <p>
              You are solely responsible for the content embedded in the QR codes you generate. You
              agree not to use this service to create QR codes for:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Illegal activities or content prohibited by law</li>
              <li>Phishing, fraud, or deceptive purposes</li>
              <li>Distributing malware, viruses, or harmful software</li>
              <li>Harassment, hate speech, or content that harms others</li>
            </ul>
            <p className="mt-2">
              The QR codes you generate are yours. We don&apos;t claim any ownership over the content
              you put into them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              No warranties
            </h2>
            <p>
              The service is provided &quot;as is&quot; without any warranty, express or implied. We are not
              liable for any damages arising from your use of this site — including but not limited to
              loss of data, business interruption, or issues arising from QR codes that don&apos;t scan
              correctly in all conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Changes to the service
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the service at any time without
              notice. We may also update these terms — if we make significant changes we&apos;ll update the
              date above.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the
              jurisdiction of courts in India.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Contact
            </h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <a
                href="mailto:ovaisbhat185@gmail.com"
                style={{ color: "#06b6d4" }}
                className="underline underline-offset-2"
              >
                ovaisbhat185@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
