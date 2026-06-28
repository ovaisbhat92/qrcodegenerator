import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free WhatsApp QR Code Generator — Chat Instantly by Scanning",
  description:
    "Create a WhatsApp QR code with a pre-filled message in seconds. Let anyone start a WhatsApp chat with you just by scanning — no number saving needed. 100% free and private.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/whatsapp-qr-code-generator",
  },
  openGraph: {
    title: "Free WhatsApp QR Code Generator — Chat Instantly by Scanning",
    description:
      "Create a WhatsApp QR code with a pre-filled message in seconds. Let anyone start a WhatsApp chat with you just by scanning — no number saving needed.",
    url: "https://www.freeqrcodemaker.in/whatsapp-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "WhatsApp QR Code Generator", item: "https://www.freeqrcodemaker.in/whatsapp-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does the person scanning need to save my number first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A WhatsApp QR code (wa.me link) opens a direct chat without requiring the scanner to save your number. They simply scan the code and tap Send — perfect for businesses and professionals.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for WhatsApp Business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Enter your WhatsApp Business number and an optional pre-filled message (e.g. 'Hi, I want to place an order'). The QR code works exactly the same for both personal and business WhatsApp accounts.",
      },
    },
    {
      "@type": "Question",
      name: "What is the pre-filled message field for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The pre-filled message is loaded into the chat text box when the scanner opens WhatsApp. They can edit it before sending. It is useful for guiding customers — for example, 'Hi, I would like to book a table for 2 tonight.'",
      },
    },
    {
      "@type": "Question",
      name: "Will this WhatsApp QR code work internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Select the correct country code from the dropdown (e.g. +91 for India, +1 for USA) and enter the phone digits without the country prefix. The QR code will open WhatsApp internationally for anyone who scans it.",
      },
    },
    {
      "@type": "Question",
      name: "Is my phone number stored or shared with anyone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The QR code is generated entirely in your browser. Your phone number is embedded only in the QR image you download — it is never sent to our servers or any third party.",
      },
    },
  ],
};

export default function WhatsAppQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <QRGenerator defaultType="whatsapp" />

        <article className="mx-auto max-w-3xl px-4 pb-16">
          <h1 className="mb-4 text-3xl font-bold">Free WhatsApp QR Code Generator</h1>

          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            A WhatsApp QR code is one of the most practical tools for Indian businesses, freelancers, and professionals. Instead of asking customers to manually type and save your number, you simply display your QR code — at your shop counter, on your visiting card, or in a brochure — and anyone with WhatsApp can start chatting with you instantly by scanning it.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to create a WhatsApp QR code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>WhatsApp</strong> tab in the generator above.</li>
            <li>Choose your country code from the dropdown (India +91 is pre-selected).</li>
            <li>Enter your WhatsApp number (digits only, no country code prefix).</li>
            <li>Optionally add a pre-filled message like &quot;Hi! I&apos;d like to know more about your services.&quot;</li>
            <li>Customise the colours and style, then download your QR code as PNG, SVG, or PDF.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Who is this useful for?</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Shop owners and restaurants</strong> can place a printed QR code at the billing counter so customers can send orders, feedback, or enquiries directly on WhatsApp. <strong>Freelancers and consultants</strong> can add a WhatsApp QR to their business card so prospects can reach them with a single scan — no need to type a number. <strong>Customer support teams</strong> can display QR codes on packaging, invoices, and websites to route customers to WhatsApp instantly.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Pre-filled messages save time</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The optional pre-filled message field is powerful. When a customer scans the QR code, WhatsApp opens with your message already typed in the chat box — they just tap Send. Use messages like &quot;I found you via your QR code and would like to enquire&quot; or &quot;Please share your menu / price list.&quot; This reduces friction and immediately tells you where the lead came from.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Works internationally</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The wa.me link format used by this generator works anywhere in the world. Select the correct country code and the QR code will route the chat to your number regardless of which country the scanner is in. Over 20 country codes are available including India, USA, UK, UAE, Singapore, and more.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">100% free, private, and browser-based</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Your phone number never leaves your device. All QR code generation happens entirely in your browser — no account required, no data collected. The downloaded QR image is yours to print, share, or embed anywhere.
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
            <Link href="/sms-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>SMS QR Code</Link>
            <Link href="/phone-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Phone QR Code</Link>
            <Link href="/vcard-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>vCard QR Code</Link>
            <Link href="/bulk-qr-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Bulk QR Generator</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
