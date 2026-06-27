import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Phone Call QR Code Generator — Click-to-Call QR Codes Free",
  description:
    "Generate a phone call QR code (tel: URI) that instantly opens the dialer when scanned. Free, customizable colors and styles. Download PNG, SVG, JPEG, or PDF — no signup.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/phone-qr-code-generator",
  },
  openGraph: {
    title: "Phone Call QR Code Generator — Click-to-Call QR Codes Free",
    description:
      "Generate a phone call QR code (tel: URI) that instantly opens the dialer when scanned. Free, customizable colors and styles. Download PNG, SVG, JPEG, or PDF — no signup.",
    url: "https://www.freeqrcodemaker.in/phone-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "Phone Call QR Code Generator", item: "https://www.freeqrcodemaker.in/phone-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to include the country code in a phone QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, including the international country code (e.g., +1 for the US, +44 for the UK, +61 for Australia) is strongly recommended. Without it, the dialer may misinterpret the number when scanned on a device set to a different locale. Always use the E.164 format: + followed by the country code and number, e.g., +14155551234.",
      },
    },
    {
      "@type": "Question",
      name: "Can I include an extension in a phone call QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some dialers support the pause character (,) or wait character (;) after the main number to handle extensions — for example, +14155551234,101 would dial the number and then automatically enter extension 101 after a pause. However, support varies across devices and carriers, so test thoroughly before using extensions in print materials.",
      },
    },
    {
      "@type": "Question",
      name: "Will a phone QR code work on all smartphones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tel: URI scheme is a universally supported standard on both iOS and Android. Any camera app, native QR scanner, or third-party scanner app on modern smartphones will recognize a phone QR code and open the native dialer. Even basic feature phones with QR support handle tel: correctly.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a phone QR code and an SMS QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A phone QR code uses the tel: URI and opens the phone dialer so the user can make a voice call. An SMS QR code uses the sms: URI and opens the messaging app with the number pre-filled (and optionally a pre-written message body). This generator creates tel: (voice call) codes. If you need an SMS code, enter the number as text in the plain-text mode with the sms: prefix manually.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a VoIP number like Google Voice or Skype?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Any valid telephone number works, including Google Voice, Twilio, RingCentral, or other VoIP numbers. The QR code simply encodes the number string; what happens when the dialer is opened depends on the user's device and app setup, not the QR code itself.",
      },
    },
  ],
};

export default function PhoneQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      {/* Generator embedded at the top, pre-set to phone type */}
      <QRGenerator defaultType="phone" />

      {/* SEO content section */}
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Phone Call QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          A phone call QR code encodes a telephone number as a{" "}
          <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-700">tel:</code> URI.
          When someone scans it, their phone&apos;s native dialer opens with your number
          pre-filled — one tap to call. No typing, no misdialled digits, no friction.
          Enter your number above, customise the design, and download in seconds.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How a Phone QR Code Works
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The QR code stores your phone number in the standardised{" "}
          <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-700">tel:</code> URI
          format — for example,{" "}
          <code className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-700">
            tel:+14155551234
          </code>. This is a recognised URI scheme supported by every modern smartphone
          operating system. When scanned:
        </p>
        <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">On iPhone (iOS):</strong> The
            Phone app opens and displays a prompt like &ldquo;Call +1 415-555-1234?&rdquo; — the user taps
            Call to connect.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">On Android:</strong> The native
            Phone or Dialer app opens with the number pre-filled in the keypad. One tap on the
            call button connects the call.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Desktop scanners (e.g., Google Lens on PC):
            </strong>{" "}
            The tel: link is shown as a clickable action; clicking it may open a VoIP app like
            Skype or Google Meet if installed.
          </li>
        </ul>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The confirmation prompt on iOS is a privacy safeguard that prevents rogue QR codes from
          auto-dialling premium numbers. It cannot be bypassed, and that is by design.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Create Your Phone Call QR Code
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              1
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Select the Phone type
              </strong>{" "}
              — it should be pre-selected on this page. If not, click the &ldquo;Phone&rdquo; tab in the
              Content section above.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              2
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Enter your phone number
              </strong>{" "}
              with the international prefix, e.g.,{" "}
              <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">
                +1 415 555 1234
              </code>
              . Spaces, dashes, and parentheses are accepted — the generator normalises them.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              3
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Style the QR code</strong> —
              pick a preset or choose custom colors, dot shapes, and corner styles that match your
              brand.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              4
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Test the live preview
              </strong>{" "}
              with your phone camera before downloading. Confirm the dialer opens with the
              correct number.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              5
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Download</strong> — choose PNG
              for digital, SVG for scalable print artwork, or PDF for a print-ready A4 sheet.
            </span>
          </li>
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Top Use Cases for Phone Call QR Codes
        </h2>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Restaurants and hospitality
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Place a phone QR code on table tents, window signage, or takeaway packaging. Customers
          can call to make a reservation, ask about allergens, or confirm opening hours with a
          single scan — without searching for your number online.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Real estate
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Stick a phone QR code on &ldquo;For Sale&rdquo; or &ldquo;For Rent&rdquo; property signs. Prospective buyers
          driving past can scan and call the listing agent instantly, removing the need to write
          down a number or find the listing online. This approach consistently increases lead
          conversion compared to printed numbers alone.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Customer service displays
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Retail stores, bank branches, and service desks can display a phone QR code at point of
          sale or waiting areas. Customers who need to follow up after leaving the location have
          the support number instantly scannable without searching through receipts or websites.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Business cards
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          A phone QR code on your business card complements your printed number. People with
          difficulty reading small text, or who prefer the convenience of tap-to-call, can use it
          without any manual entry. Pair it with a{" "}
          <Link
            href="/vcard-qr-code-generator"
            className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
          >
            vCard QR code
          </Link>{" "}
          on the same card for the full contact experience.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Events and conferences
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Name badges, lanyards, and programme booklets can include a phone QR code for speakers,
          organisers, or emergency contacts. Attendees scan and call without having to type or
          remember numbers.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Number Format Tips
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Getting the format right ensures your QR code dials correctly on every device,
          regardless of where the person scanning it is located:
        </p>
        <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Always use the international prefix.
            </strong>{" "}
            Start with a + followed by the country code. US/Canada: +1. UK: +44. Australia: +61.
            Germany: +49.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              You do not need to strip spaces.
            </strong>{" "}
            This generator accepts numbers with spaces, dashes, dots, and parentheses. The
            encoded{" "}
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">tel:</code> URI
            will be clean.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Test on both iOS and Android.
            </strong>{" "}
            Dialers on different platforms interpret number formats slightly differently. A quick
            test on each platform before printing avoids problems at scale.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Label the QR code with a call to action.
            </strong>{" "}
            Add text near the code such as &ldquo;Scan to call us&rdquo; or &ldquo;Call for reservations&rdquo; so users
            know what to expect before they scan.
          </li>
        </ul>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Other QR code generators
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/url-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                URL QR Code Generator
              </Link>{" "}
              — link to any website from a printed code
            </li>
            <li>
              <Link
                href="/vcard-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                vCard QR Code Generator
              </Link>{" "}
              — share your full contact details — name, email, address — in one scan
            </li>
            <li>
              <Link
                href="/qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                QR Code Generator Hub
              </Link>{" "}
              — overview of all types and when to use each
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <h2 className="mb-6 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqSchema.mainEntity.map((item) => (
            <div key={item.name}>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">{item.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
