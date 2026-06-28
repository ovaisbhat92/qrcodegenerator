import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free Email QR Code Generator — Create Mailto QR Codes Online",
  description:
    "Generate a mailto QR code with pre-filled subject and body. Scan to open an email compose window instantly — perfect for business cards, print materials, and event badges.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/email-qr-code-generator",
  },
  openGraph: {
    title: "Free Email QR Code Generator — Create Mailto QR Codes Online",
    description:
      "Generate a mailto QR code with pre-filled subject and body. Scan to open an email compose window instantly — perfect for business cards, print materials, and event badges.",
    url: "https://www.freeqrcodemaker.in/email-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "Email QR Code Generator", item: "https://www.freeqrcodemaker.in/email-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happens when someone scans an email QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The scanner's default email app opens with a new compose window pre-filled with your email address, and optionally the subject and body you specified. They simply tap Send. This works with Gmail, Outlook, Apple Mail, and most other email clients.",
      },
    },
    {
      "@type": "Question",
      name: "What is a mailto QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A mailto QR code encodes a mailto: URI — a standard internet link format that triggers the device's email client. The URI can include the recipient address, a subject line, and a pre-written body. Most smartphones support mailto links natively in their camera and email apps.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pre-fill the email subject and body?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The generator lets you set an optional subject and body. For example, you could pre-fill the subject as 'Enquiry from QR code' so you immediately know where the email came from. The scanner can edit both fields before sending.",
      },
    },
    {
      "@type": "Question",
      name: "Which email apps support mailto QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All major email apps support the mailto URI: Gmail, Apple Mail, Outlook, Yahoo Mail, Spark, and any other standards-compliant email client. The device will prompt the user to choose their default email app if more than one is installed.",
      },
    },
    {
      "@type": "Question",
      name: "Is the email address stored on any server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The QR code is generated entirely in your browser. Your email address is encoded into the QR image you download and is never transmitted to our servers or any third party.",
      },
    },
  ],
};

export default function EmailQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <QRGenerator defaultType="email" />

        <article className="mx-auto max-w-3xl px-4 pb-16">
          <h1 className="mb-4 text-3xl font-bold">Free Email QR Code Generator</h1>

          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            An email QR code (also called a mailto QR code) lets anyone send you an email simply by scanning a code with their phone camera. When scanned, the device opens its default email app with a new compose window pre-filled with your address — and optionally, a subject and body. No typing required.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to create an email QR code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>Email</strong> tab in the generator above.</li>
            <li>Enter the recipient email address (e.g. your business email).</li>
            <li>Optionally fill in a subject line and email body.</li>
            <li>Customise the QR code colours and style.</li>
            <li>Download as PNG, SVG, JPEG, or PDF and add it to your materials.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Where to use an email QR code</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Business cards and name badges</strong> — attendees at events and conferences can email you without typing. <strong>Product packaging</strong> — customers can scan and send feedback or support requests instantly. <strong>Printed brochures and flyers</strong> — readers can reach out without switching to a keyboard. <strong>Office signage and reception areas</strong> — visitors can contact you with a quick scan.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Pre-filled subject helps you track leads</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Adding a subject like &quot;Enquiry via QR code — brochure&quot; lets you immediately identify that the email came from a printed flyer. You can use different QR codes on different materials, each with a different subject, to track which channel drives the most email enquiries.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Works with all major email clients</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The mailto URI standard is supported by Gmail, Apple Mail, Outlook, Yahoo Mail, and virtually every email client on Android and iOS. If the user has multiple email apps installed, their device will prompt them to choose.
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
            <Link href="/sms-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>SMS QR Code</Link>
            <Link href="/vcard-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>vCard QR Code</Link>
            <Link href="/bulk-qr-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Bulk QR Generator</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
