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
            An email QR code — also called a mailto QR code — lets anyone send you an email simply
            by scanning a code with their phone camera. When scanned, the device opens its default
            email app with a new compose window pre-filled with your address, and optionally a
            subject and body. No typing required, no copying and pasting an address. It is the
            fastest bridge between a printed surface and an email conversation.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">What Is a Mailto QR Code?</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            A mailto QR code encodes a{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>mailto:</code>{" "}
            URI — the same standard internet link format used in web pages for &quot;Email Us&quot;
            buttons. The full URI looks like this:{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>
              mailto:hello@example.com?subject=Enquiry&amp;body=Hi%2C%20I%27d%20like%20to%20know%20more
            </code>. When a phone camera or QR scanner reads the code, it passes this URI to the
            operating system, which opens whatever app is set as the default email client. The
            standard is supported natively on every modern smartphone — no special app installation
            needed.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to Create an Email QR Code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>Email</strong> tab in the generator above.</li>
            <li>Enter the recipient email address — usually your business or contact email.</li>
            <li>Optionally fill in a subject line (e.g. &quot;Enquiry from QR code&quot;).</li>
            <li>Optionally add an email body to guide the sender (e.g. &quot;Hi, I found your QR code at [event] and would like to learn more.&quot;).</li>
            <li>Customise the QR code colours, dot shape, and corner style.</li>
            <li>Download as PNG, SVG, JPEG, WebP, or PDF and place it on your materials.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Where to Use an Email QR Code</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Email QR codes work across a wide range of physical and digital surfaces:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong>Business cards and name badges</strong> — conference attendees and networking
              contacts can email you without typing. A QR code alongside your printed email address
              doubles the conversion rate for people who scan rather than type.
            </li>
            <li>
              <strong>Product packaging</strong> — customers can scan and send product feedback,
              warranty registration requests, or support queries directly from the box, with no
              need to visit a website first.
            </li>
            <li>
              <strong>Printed brochures and flyers</strong> — readers who want to enquire can reach
              out without switching to a keyboard. A clear call to action like &quot;Scan to email
              us&quot; next to the QR code drives conversions.
            </li>
            <li>
              <strong>Event badges and lanyards</strong> — speakers and exhibitors can use email
              QR codes so attendees can follow up after a presentation without hunting for contact
              details.
            </li>
            <li>
              <strong>Email campaigns and PDF attachments</strong> — embed an email QR code in a
              PDF proposal or quote so the recipient can reply from another device instantly.
            </li>
          </ul>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Pre-Filling Subject and Body</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The subject and body fields are optional but highly recommended. A well-chosen subject
            line does two things: it tells you exactly where the email came from, and it saves the
            sender time. Here are some effective examples:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li><strong>Business card:</strong> Subject — &quot;Meeting follow-up from [Your Name]&quot;</li>
            <li><strong>Product packaging:</strong> Subject — &quot;Feedback on [Product Name]&quot;</li>
            <li><strong>Event badge:</strong> Subject — &quot;Conference enquiry — scanned your badge&quot;</li>
            <li><strong>Brochure:</strong> Subject — &quot;Enquiry via brochure QR code&quot;</li>
          </ul>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            For best scan reliability, keep the combined length of subject and body under 200
            characters. Longer strings produce denser QR codes that are harder to scan in low
            light or at small print sizes. If you need a longer message, keep the subject short
            and leave the body empty — the sender can fill in the details themselves.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Email Client Compatibility</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>mailto:</code>{" "}
            URI is a decades-old internet standard supported universally. On Android, it opens
            Gmail by default (or the user&apos;s chosen email app). On iOS, it opens Apple Mail
            unless the user has changed their default to Gmail, Outlook, or another client. On
            desktop computers that happen to have a QR scanner, it opens Outlook, Apple Mail, or
            the system default. Yahoo Mail, Spark, Fastmail, and any other RFC-compliant email
            client also responds correctly to{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>mailto:</code>{" "}
            links. If the user has multiple email apps installed, the OS will prompt them to choose.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Tracking Leads with Different Subject Lines</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            One of the most practical techniques for print marketers is using a unique subject line
            per QR code placement. Generate one email QR code for your trade show banner with
            subject &quot;Enquiry — trade show&quot;, another for your direct mail piece with subject
            &quot;Enquiry — mailer&quot;, and a third for your magazine ad with subject &quot;Enquiry —
            magazine&quot;. When emails arrive in your inbox, you instantly know which channel drove the
            contact — no click-tracking software required. Filter your inbox by subject line at the
            end of each campaign to compare channel performance.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Download Formats and Customisation</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Download your email QR code as <strong>PNG</strong> for digital use and standard print,
            <strong> SVG</strong> for large-format printing that stays crisp at any size,
            <strong> JPEG</strong> for web embeds where file size matters, <strong>WebP</strong>
            for fast-loading web pages, or <strong>PDF</strong> for a print-ready A4 file to hand
            to a designer or print shop. Use the Customise panel to change colours, choose a dot
            style, and upload your logo for a fully branded QR code.
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
              <Link href="/whatsapp-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>WhatsApp QR Code Generator</Link>
              <Link href="/sms-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>SMS QR Code Generator</Link>
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
