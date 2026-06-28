import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free SMS QR Code Generator — Send Text Messages by Scanning",
  description:
    "Create an SMS QR code that opens a pre-filled text message on any phone. Perfect for customer support, appointment reminders, and marketing campaigns. Free, private, browser-based.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/sms-qr-code-generator",
  },
  openGraph: {
    title: "Free SMS QR Code Generator — Send Text Messages by Scanning",
    description:
      "Create an SMS QR code that opens a pre-filled text message on any phone. Perfect for customer support, appointment reminders, and marketing campaigns.",
    url: "https://www.freeqrcodemaker.in/sms-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "SMS QR Code Generator", item: "https://www.freeqrcodemaker.in/sms-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happens when someone scans an SMS QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The scanner's default SMS app opens with a new message pre-addressed to your phone number, and optionally the message text you specified. The user can edit the message and tap Send. This works on both Android and iOS without any app installation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to include a country code in the phone number?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For international use, include the full international format (e.g. +91 for India, +1 for USA). For local-only use, you can enter just the local number. Including the country code ensures the QR code works for anyone who scans it from any country.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a pre-filled text message?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The optional message field is loaded into the SMS compose screen when the QR code is scanned. For example, 'CONFIRM' for appointment reminders, or 'INFO' to request a product catalogue. The user can edit it before sending.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best uses for an SMS QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SMS QR codes are ideal for customer support lines (scan to text us), appointment booking confirmations, opt-in campaigns (scan to subscribe to SMS updates), feedback collection, and two-factor authentication fallbacks. They work great on physical signage, packaging, and printed marketing materials.",
      },
    },
    {
      "@type": "Question",
      name: "Is the phone number stored anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The QR code is generated entirely in your browser using JavaScript. Your phone number is encoded only in the QR image you download — it is never sent to our servers or shared with third parties.",
      },
    },
  ],
};

export default function SmsQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <QRGenerator defaultType="sms" />

        <article className="mx-auto max-w-3xl px-4 pb-16">
          <h1 className="mb-4 text-3xl font-bold">Free SMS QR Code Generator</h1>

          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            An SMS QR code encodes a phone number (and optionally a pre-written text message) into a scannable code. When anyone scans it with their phone camera, the default messaging app opens with your number already filled in, ready to send. No app download or internet connection required.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to create an SMS QR code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>SMS</strong> tab in the generator above.</li>
            <li>Enter the phone number including the country code (e.g. +91 9876543210).</li>
            <li>Optionally type a pre-filled message (e.g. &quot;BOOK&quot; or &quot;I would like more information&quot;).</li>
            <li>Customise the style and download as PNG, SVG, or PDF.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Top use cases for SMS QR codes</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Customer support</strong> — place a &quot;Text us&quot; QR on product packaging or receipts so customers can instantly reach your support line without typing a number. <strong>Appointment reminders</strong> — let patients or clients confirm appointments by scanning a code that sends &quot;CONFIRM&quot; to your number. <strong>SMS opt-in campaigns</strong> — use a QR on print ads or posters to let customers subscribe to SMS promotions with a single scan. <strong>Event RSVPs</strong> — guests scan and text their name to confirm attendance.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Works on all phones without internet</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The sms: URI scheme is supported natively on Android and iOS. Unlike WhatsApp or email QR codes, SMS works even in areas with poor internet connectivity — perfect for outdoor signage, rural marketing, and any situation where data access cannot be guaranteed.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Pre-filled keywords for automation</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            If you use SMS automation software, add a keyword as the pre-filled message — for example, &quot;JOIN&quot; or &quot;STOP&quot;. When the customer scans and sends, your automation system processes the keyword automatically. This is a common pattern for loyalty programmes, opt-ins, and unsubscribes.
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
            <Link href="/phone-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Phone QR Code</Link>
            <Link href="/bulk-qr-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Bulk QR Generator</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
