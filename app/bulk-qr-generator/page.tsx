import type { Metadata } from "next";
import Link from "next/link";
import BulkQRGenerator from "@/components/BulkQRGenerator";

export const metadata: Metadata = {
  title: "Free Bulk QR Code Generator — Generate Multiple QR Codes at Once",
  description:
    "Generate up to 100 QR codes at once from a CSV file or manual input. Download all as a ZIP with PNG files and a summary report. Free, private, browser-based.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/bulk-qr-generator",
  },
  openGraph: {
    title: "Free Bulk QR Code Generator — Generate Multiple QR Codes at Once",
    description:
      "Generate up to 100 QR codes at once from a CSV file or manual input. Download all as a ZIP with PNG files and a summary report.",
    url: "https://www.freeqrcodemaker.in/bulk-qr-generator",
    siteName: "QR Code Generator",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.freeqrcodemaker.in/" },
    { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://www.freeqrcodemaker.in/qr-code-generator" },
    { "@type": "ListItem", position: 3, name: "Bulk QR Generator", item: "https://www.freeqrcodemaker.in/bulk-qr-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many QR codes can I generate at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate up to 100 QR codes per batch. Upload a CSV with up to 100 rows, or enter rows manually. If your CSV has more than 100 rows, only the first 100 will be processed. Run multiple batches for larger volumes.",
      },
    },
    {
      "@type": "Question",
      name: "What file format are the generated QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All QR codes are generated as PNG images and bundled into a ZIP file. The ZIP also includes a summary.csv file listing each row's input data, the output filename, and the generation status (success or error).",
      },
    },
    {
      "@type": "Question",
      name: "What CSV format should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The required columns depend on the QR type you select. Click 'Download sample CSV' in Step 2 to get a properly formatted template with example rows. The first row must be the header row with column names in lowercase.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data uploaded to a server during bulk generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All bulk QR code generation happens entirely in your browser using JavaScript. Your CSV data and the generated QR codes never leave your device. Nothing is sent to our servers.",
      },
    },
    {
      "@type": "Question",
      name: "Which QR types are supported for bulk generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The bulk generator supports: Website URL, Plain Text, Phone Number, WhatsApp, Email, SMS, UPI Pay, vCard Contact, and Location (GPS coordinates or Google Maps link).",
      },
    },
    {
      "@type": "Question",
      name: "Can I customise the appearance of bulk QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In Step 3 you can set the foreground (QR module) colour, background colour, size (128×128, 256×256, or 512×512 pixels), and error correction level (L, M, Q, H). The same style is applied to all QR codes in the batch.",
      },
    },
  ],
};

export default function BulkQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <div className="mx-auto max-w-6xl px-4 py-10">
          {/* Hero */}
          <div className="relative mb-10 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-48"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 70%)" }}
            />
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
              style={{ border: "1px solid rgba(6,182,212,0.4)", color: "#06b6d4", background: "rgba(6,182,212,0.08)" }}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Free · No signup · Browser-only
            </div>
            <h1 className="gradient-text text-4xl font-extrabold lg:text-5xl" style={{ letterSpacing: "-0.5px" }}>
              Bulk QR Code Generator
            </h1>
            <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
              Generate up to 100 QR codes at once from a CSV file or manual input — download them all as a ZIP in seconds.
            </p>
          </div>

          <BulkQRGenerator />
        </div>

        <article className="mx-auto max-w-3xl px-4 pb-16">
          <h2 className="mb-4 mt-12 text-2xl font-bold">What is a bulk QR code generator?</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            A bulk QR code generator lets you create dozens or hundreds of QR codes at once instead of making them one at a time. You provide a spreadsheet (CSV file) with one row per QR code, and the generator produces a PNG image for each row, packages them all into a ZIP file, and gives you a download link — all in your browser without any server.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How it works</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li><strong>Choose a QR type</strong> — URL, text, phone, WhatsApp, email, SMS, UPI, vCard, or location.</li>
            <li><strong>Add data</strong> — upload a CSV with one row per QR code, or enter rows manually in the table. Download the sample CSV for the correct column format.</li>
            <li><strong>Customise</strong> — set the QR colour, background, size, and error correction level. Preview the first row before generating.</li>
            <li><strong>Download</strong> — click Generate and watch the progress bar. When done, download your ZIP containing all PNG files plus a summary.csv.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Who is this useful for?</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Event organisers</strong> can generate a unique URL QR code for each attendee&apos;s badge or ticket. <strong>E-commerce sellers</strong> can create QR codes for product pages, one per SKU, from a product CSV export. <strong>Marketing agencies</strong> can produce campaign-specific URL QR codes for different cities or channels in a single batch. <strong>Restaurant chains</strong> can generate individual UPI QR codes for each branch. <strong>HR teams</strong> can create vCard QR codes for all employees&apos; business cards at once.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">The summary CSV explained</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The ZIP includes a <code>summary.csv</code> file that lists every row: the row number, a preview of the input data, the output PNG filename, and whether generation succeeded or failed. This makes it easy to audit the batch and reprocess any rows that errored — for example, if a URL was malformed or a UPI ID was missing.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">100% private and client-side</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Every QR code is generated locally in your browser using JavaScript. Your CSV data, whether it contains customer phone numbers, product URLs, or payment IDs, never leaves your device. No account is required and nothing is stored on our servers.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <summary className="cursor-pointer font-semibold">{faq.name}</summary>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>

          <nav className="mt-10 flex flex-wrap gap-3 text-sm" aria-label="Related tools">
            <Link href="/qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>QR Code Generator</Link>
            <Link href="/whatsapp-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>WhatsApp QR Code</Link>
            <Link href="/email-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Email QR Code</Link>
            <Link href="/sms-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>SMS QR Code</Link>
            <Link href="/upi-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>UPI QR Code</Link>
            <Link href="/vcard-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>vCard QR Code</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
