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
      name: "Does an SMS QR code work on iPhone (iOS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but with a caveat. iOS uses the sms: URI scheme and pre-filled messages generally work in the native Messages app. However, pre-filled message support can be inconsistent on some iOS versions. Android's messaging apps handle the smsto: format reliably. Always test your QR code on both platforms before printing.",
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
            An SMS QR code encodes a phone number — and optionally a pre-written text message —
            into a scannable code. When anyone scans it with their phone camera, the default
            messaging app opens with your number already filled in, ready to send. No app download,
            no WhatsApp account, and no internet connection required beyond the cellular network
            itself. It is the most universally compatible way to let someone text you from a
            printed surface.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How the smsto: URI Format Works</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            SMS QR codes use the{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>smsto:</code>{" "}
            URI scheme, a standard supported by Android messaging apps and the iOS native Messages
            app. The URI structure is simple:{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>smsto:+919876543210:CONFIRM</code> —
            where the number comes first, followed by a colon, then the optional pre-filled message.
            When the phone camera decodes this URI, it passes it to the operating system, which
            opens the default SMS application with the number and message pre-loaded. The sender
            just taps Send.
          </p>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            When entering the phone number, use only digits and the{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>+</code>{" "}
            prefix for the country code. Strip any spaces, dashes, parentheses, or other formatting
            characters from the number — these can cause the URI to fail on some devices. For
            example, enter{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>+919876543210</code>{" "}
            rather than{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>+91 98765-43210</code>.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How to Create an SMS QR Code</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>Select the <strong>SMS</strong> tab in the generator above.</li>
            <li>Enter the phone number with country code — digits only (e.g. +91 9876543210).</li>
            <li>Optionally type a pre-filled message such as &quot;CONFIRM&quot;, &quot;BOOK&quot;, or &quot;I would like more information.&quot;</li>
            <li>Customise the dot style, colours, and optionally add your logo.</li>
            <li>Download as PNG, SVG, JPEG, WebP, or PDF.</li>
          </ol>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Top Use Cases for SMS QR Codes</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            SMS QR codes are practical across many industries precisely because they work without
            internet access and require no account on the sender&apos;s side:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong>Appointment reminders and confirmations</strong> — clinics, salons, and
              service businesses can print a QR code on appointment cards. Patients scan and send
              &quot;CONFIRM&quot; or &quot;CANCEL&quot; with a single tap, reducing no-shows without
              requiring a phone call.
            </li>
            <li>
              <strong>Customer support lines</strong> — place a &quot;Text us&quot; QR code on product
              packaging, receipts, or delivery notes so customers can reach your support number
              immediately, without typing.
            </li>
            <li>
              <strong>Delivery notifications</strong> — logistics companies can include a QR code
              on delivery attempts so recipients can schedule a re-delivery by texting a keyword.
            </li>
            <li>
              <strong>SMS marketing opt-ins</strong> — display a QR code on a poster, billboard,
              or print ad with the pre-filled message &quot;JOIN&quot; or &quot;SUBSCRIBE&quot; to let
              customers enrol in your SMS mailing list with a single scan, no web form required.
            </li>
            <li>
              <strong>Event RSVPs</strong> — guests scan a QR code on the invitation and send
              their name to confirm attendance, with no app or website login needed.
            </li>
            <li>
              <strong>Emergency and safety signage</strong> — in areas where internet may be
              unreliable, an SMS QR code on safety signage lets people text for help using only
              cellular coverage.
            </li>
          </ul>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Android vs iOS Compatibility</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            SMS QR codes work on both Android and iOS, but with slight differences worth knowing
            before you print. <strong>Android</strong> has the most consistent support: the{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>smsto:</code>{" "}
            URI with a pre-filled message body is reliably handled by the default Messages app, as
            well as third-party apps like Google Messages, Samsung Messages, and others.{" "}
            <strong>iOS</strong> supports the{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>sms:</code>{" "}
            URI natively in the Apple Messages app, but pre-filled message body support has varied
            across iOS versions — some older versions open the compose window but leave the body
            blank. For campaigns that rely on a specific keyword being sent, always test on a
            representative iOS device before going live. For simple &quot;open a text to this number&quot;
            use cases — where the user types their own message — iOS works perfectly.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Pre-Filled Message Best Practices</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The pre-filled message is the feature that makes SMS QR codes genuinely powerful for
            automation. When crafting your message:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong>Use short, uppercase keywords</strong> for automation systems — &quot;JOIN&quot;,
              &quot;STOP&quot;, &quot;CONFIRM&quot;, &quot;INFO&quot;. These are easy for SMS automation
              platforms to parse and act on.
            </li>
            <li>
              <strong>Keep the message under 80 characters</strong> for maximum compatibility
              across devices and operating systems.
            </li>
            <li>
              <strong>Avoid special characters</strong> in the message — emoji, ampersands, and
              percent signs can interfere with URI encoding and cause the QR code to fail on
              some devices.
            </li>
            <li>
              <strong>Use plain descriptive text</strong> when the sender types manually: &quot;I
              would like a quote for [service]&quot; or &quot;Please call me back.&quot;
            </li>
          </ul>

          <h2 className="mb-3 mt-8 text-xl font-semibold">SMS QR Code vs WhatsApp QR Code</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The choice between an SMS QR code and a{" "}
            <Link href="/whatsapp-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>WhatsApp QR code</Link>{" "}
            depends on your audience. SMS works on every mobile phone without any additional
            app — ideal for reaching a broad demographic, rural areas with limited data access,
            or older customers who may not use WhatsApp. WhatsApp QR codes offer richer messaging
            (images, documents, voice notes) and are better suited for businesses whose customers
            are already active WhatsApp users. If you are targeting a younger, urban audience in
            India, the Middle East, or Southeast Asia where WhatsApp penetration is very high, a
            WhatsApp QR code is often more effective. For universal reach across all demographics,
            use an SMS QR code.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Download Formats and Customisation</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Once you are satisfied with your SMS QR code, download it in the format that suits your
            use case. <strong>PNG</strong> is ideal for digital sharing and most standard print
            jobs. <strong>SVG</strong> is the best choice for large-format printing — banners,
            window stickers, or outdoor signage — because it scales to any size without losing
            clarity. <strong>PDF</strong> provides a print-ready A4 file to hand directly to a
            designer or print shop. Use the Customise panel to select your foreground and background
            colours, choose a dot shape, and optionally add your logo for a branded QR code that
            matches your marketing materials.
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
