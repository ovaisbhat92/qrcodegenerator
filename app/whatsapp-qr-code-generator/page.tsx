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
            A WhatsApp QR code is one of the most practical contact tools available for businesses,
            freelancers, and professionals. Instead of asking customers to manually type and save your
            number, you display your QR code — on a shop counter, a visiting card, or a brochure —
            and anyone with WhatsApp can start chatting with you instantly by scanning it. No number
            saving, no friction, no lost leads.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How WhatsApp QR Codes Work</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            This generator encodes a <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>wa.me</code> link
            into the QR code. The <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>wa.me</code> format
            is WhatsApp&apos;s official click-to-chat URL structure — for example,{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>https://wa.me/919876543210</code>. When
            a phone camera scans the QR code, the device opens WhatsApp directly in a new chat with
            your number. If you have also specified a pre-filled message, that text appears in the
            compose box ready for the user to send. The entire interaction requires no app download
            and no internet connection beyond WhatsApp itself being installed.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to Create a WhatsApp QR Code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>WhatsApp</strong> tab in the generator above.</li>
            <li>Choose your country code from the dropdown (India +91 is pre-selected; over 20 countries are supported).</li>
            <li>Enter your WhatsApp number — digits only, without the country prefix.</li>
            <li>Optionally add a pre-filled message such as &quot;Hi! I&apos;d like to know more about your services.&quot;</li>
            <li>Customise the colours, dot style, and corner shape to match your brand.</li>
            <li>Download your QR code as PNG, SVG, JPEG, WebP, or print-ready PDF.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Who Benefits Most from WhatsApp QR Codes?</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Shop owners and restaurants</strong> can place a printed QR code at the billing
            counter or on a table tent so customers can send orders, feedback, or enquiries directly
            on WhatsApp — without staff having to repeat a number. <strong>Freelancers and
            consultants</strong> can add a WhatsApp QR to their business card so prospects reach
            them with a single scan, making the follow-up process effortless. <strong>Customer
            support teams</strong> at e-commerce companies and service businesses can display QR
            codes on packaging, invoices, and websites to route inbound queries straight to
            WhatsApp, reducing call centre load. <strong>Event organisers</strong> can print a QR
            on registration confirmations so attendees can message the organiser with last-minute
            questions. <strong>Real-estate agents</strong> and <strong>car dealerships</strong> use
            WhatsApp QRs on property listings and vehicle brochures so interested buyers can initiate
            a conversation from the printed material without ever visiting a website.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Using Pre-Filled Messages Effectively</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The optional pre-filled message field is one of the most powerful features of a WhatsApp
            QR code. When a customer scans the code, WhatsApp opens with your message already in the
            compose box — they just tap Send. This creates an immediate, low-friction conversation
            starter. Here are proven message templates you can use:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li><strong>General enquiry:</strong> &quot;Hi! I found your QR code and would like more information.&quot;</li>
            <li><strong>Restaurant / café:</strong> &quot;Hi, I&apos;d like to place a takeaway order.&quot;</li>
            <li><strong>Appointment booking:</strong> &quot;Hi, I&apos;d like to book an appointment.&quot;</li>
            <li><strong>Product support:</strong> &quot;Hi, I need help with my recent order.&quot;</li>
            <li><strong>Lead source tracking:</strong> &quot;Hi, I scanned the QR code from your brochure.&quot; — this tells you exactly which marketing material generated the contact.</li>
          </ul>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Keep pre-filled messages under 100 characters for best compatibility across devices and
            operating systems. Very long messages can be truncated on some phones.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">WhatsApp Business Integration</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>wa.me</code> link
            format works identically for both personal WhatsApp and WhatsApp Business accounts. If
            you use WhatsApp Business, the QR code will open a chat with your business profile,
            showing your business name, description, and category to the scanner before they send
            their first message. This adds credibility and professionalism compared to a plain
            personal number.
          </p>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            WhatsApp Business also supports quick replies, automated greeting messages, and away
            messages. Pairing a well-crafted QR code with these features means your business can
            respond to new chat contacts even outside working hours.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">International Use and Country Codes</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The generator supports country codes for over 20 countries including India (+91), the
            United States (+1), the United Kingdom (+44), the UAE (+971), Singapore (+65), Australia
            (+61), Canada (+1), and more. Always select your country code from the dropdown and
            enter only the local digits in the phone number field — the generator handles combining
            them correctly. This ensures the QR code opens a chat with the right international
            number for anyone who scans it, wherever they are in the world.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Download Formats and Customisation</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Once you are happy with your QR code design, download it in the format that suits your
            use case. <strong>PNG</strong> works for digital sharing, email, and most standard print
            jobs. <strong>SVG</strong> is the best choice for large-format printing — banners,
            posters, or shopfront window stickers — because it scales to any size without losing
            sharpness. <strong>PDF</strong> gives you a print-ready A4 file you can hand straight
            to a print shop. Use the Customise panel to change foreground and background colours,
            choose a dot shape (square, rounded, dots), and optionally add your logo to the centre
            for a branded look.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <summary className="cursor-pointer font-semibold">{faq.name}</summary>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <p className="mb-3 text-sm font-semibold">Related QR code generators</p>
            <nav className="flex flex-wrap gap-3 text-sm" aria-label="Related tools">
              <Link href="/sms-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>SMS QR Code Generator</Link>
              <Link href="/phone-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Phone QR Code Generator</Link>
              <Link href="/vcard-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>vCard QR Code Generator</Link>
              <Link href="/qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>QR Code Generator</Link>
              <Link href="/bulk-qr-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Bulk QR Generator</Link>
            </nav>
          </div>
        </article>
      </main>
    </>
  );
}
