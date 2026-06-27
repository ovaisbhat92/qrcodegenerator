import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice — Free QR Code Maker",
  description:
    "Our privacy notice explains what data we collect (very little), how we use it, and how your QR code content stays private in your browser.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/privacy",
  },
  robots: { index: false },
};

export default function PrivacyPage() {
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
        <h1 className="gradient-text mb-1 text-3xl font-extrabold">Privacy Notice</h1>
        <p className="mb-8 text-sm" style={{ color: "var(--text-hint)" }}>Last updated: June 2026</p>

        <div className="space-y-7 leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              The short version
            </h2>
            <p>
              This tool generates QR codes entirely inside your browser. Nothing you type — UPI IDs,
              phone numbers, URLs, contact details, or any other content — is ever sent to our servers.
              We do not collect it, store it, or see it. Ever.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              What data do we collect?
            </h2>
            <p>
              Almost none. We collect anonymous usage statistics through Google Analytics — things like
              which pages were visited, how long sessions last, and what country traffic comes from.
              This data contains no personal information and cannot be tied back to you as an individual.
            </p>
            <p className="mt-2">
              We do not run any server-side code that touches your QR content. There are no user
              accounts, no logins, and no database storing anything you&apos;ve entered.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Cookies and local storage
            </h2>
            <p>
              We do not use cookies for tracking. We use your browser&apos;s <code className="rounded px-1 text-xs" style={{ background: "var(--bg-input)" }}>localStorage</code> to
              remember your QR customization preferences (things like dot style, colours, and size) so
              you don&apos;t have to re-enter them each visit. This data stays on your device and is never
              transmitted anywhere.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Logo uploads
            </h2>
            <p>
              If you upload a logo to embed in your QR code, that image is processed entirely in your
              browser using the Canvas API. It is never uploaded to any server. The file stays on
              your device and is discarded when you close or refresh the page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Third-party services
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Google Analytics</strong> — anonymous traffic analysis. Governed by
                Google&apos;s privacy policy.
              </li>
              <li>
                <strong>Vercel</strong> — website hosting. Vercel may log standard server access
                logs (IP address, request path, timestamps) for security and reliability purposes.
              </li>
              <li>
                <strong>Google AdSense</strong> — advertising slots may appear on the site. Ads
                are served by Google and subject to Google&apos;s privacy policy. Ad slots may not
                always be active.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Children&apos;s privacy
            </h2>
            <p>
              This service is not directed at children under 13. We do not knowingly collect any
              information from children.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Changes to this notice
            </h2>
            <p>
              If we ever change how we handle data, we&apos;ll update this page. Given that we collect
              almost nothing, significant changes are unlikely.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Contact
            </h2>
            <p>
              For any privacy-related questions, email us at{" "}
              <a
                href="mailto:contact@freeqrcodemaker.in"
                style={{ color: "#06b6d4" }}
                className="underline underline-offset-2"
              >
                contact@freeqrcodemaker.in
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
