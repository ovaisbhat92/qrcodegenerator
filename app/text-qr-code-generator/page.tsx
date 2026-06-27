import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Text QR Code Generator — Create Scannable Plain Text QR Codes",
  description:
    "Turn any message, note, or instruction into a scannable QR code. No URL needed — just text. Works offline. Customize colors and download free as PNG, SVG, or PDF.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/text-qr-code-generator",
  },
  openGraph: {
    title: "Text QR Code Generator — Create Scannable Plain Text QR Codes",
    description:
      "Turn any message, note, or instruction into a scannable QR code. No URL needed — just text. Works offline. Customize colors and download free as PNG, SVG, or PDF.",
    url: "https://www.freeqrcodemaker.in/text-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "Text QR Code Generator", item: "https://www.freeqrcodemaker.in/text-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the maximum text length for a QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The theoretical maximum is 2,953 bytes using binary mode, which corresponds to approximately 2,000 standard ASCII characters. In practice, codes above 500 characters become dense enough that older or budget phone cameras may struggle to scan them reliably, especially in low lighting or at small print sizes. Keep text under 300 characters for broad compatibility.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use emoji or special characters in a text QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Emoji and Unicode characters are supported, but they are encoded in UTF-8 and each emoji typically occupies 4 bytes rather than 1. A message containing 10 emoji uses roughly the same density budget as 40 plain ASCII characters. Use emoji sparingly in longer messages, and always test the final code before printing.",
      },
    },
    {
      "@type": "Question",
      name: "How does the scanned text appear on the recipient's device?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On iPhone, the native Camera app shows the decoded text in a notification banner at the top of the screen. Tapping the banner opens the text in a simple viewer. On Android, Google Lens and most camera apps display the raw text with options to copy it. There is no special formatting — the text appears exactly as you typed it, including line breaks.",
      },
    },
    {
      "@type": "Question",
      name: "Can I include a clickable link inside a text QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can type a URL into a text QR code, but it will appear as plain text rather than a tappable link on most scanners. If you want scanning to open a URL directly, use the URL type instead of the Text type — that encodes the link as a proper URI, and the scanner will offer to open it in the browser automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Why is a text QR code harder to scan than a URL QR code with the same number of characters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URL QR codes often benefit from QR's alphanumeric encoding mode, which represents uppercase letters and digits using only 5.5 bits per character — roughly twice as efficient as the byte mode used for arbitrary text. A URL like HTTPS://EXAMPLE.COM/PAGE packs more efficiently than mixed-case prose. To improve scannability of text codes, keep messages short, use uppercase text where readability allows, and set error correction to H.",
      },
    },
  ],
};

export default function TextQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultType="text" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Text QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Unlike a URL QR code, a plain text QR code encodes your message directly inside the
          image — no website, no link, no server required. When someone scans it, the full text
          appears immediately on their screen. No app to install, and it works without an internet
          connection. Type or paste your message above and download in seconds.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          When to Use a Plain Text QR Code
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Some content simply does not need a link. These are the scenarios where a text QR code
          outperforms every other type:
        </p>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Museum and gallery labels.</strong>{" "}
            Display artist bios, artwork descriptions, or historical notes without redirecting
            visitors to a website. The text loads instantly and requires no connectivity.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Recipe cards and food packaging.</strong>{" "}
            Encode a short ingredient list or preparation note on a physical card or label. Guests
            scan to read; no typing required.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Hotel and venue instructions.</strong>{" "}
            Checkout procedures, emergency exit routes, amenity guides, and house rules — encode
            them once, print them anywhere, no URL to maintain.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Product assembly and care notes.</strong>{" "}
            Short assembly steps, washing instructions, or storage guidelines that do not warrant
            a dedicated webpage.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Classroom and training materials.</strong>{" "}
            Quiz answer keys, vocabulary lists, quick-reference guides, or reading extracts for
            offline distribution.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Event programmes.</strong>{" "}
            Speaker bios, session descriptions, table plans, or conference floor layouts that are
            self-contained and do not need live updates.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Temporary signage.</strong>{" "}
            &ldquo;Out of order&rdquo; notices, directional instructions at pop-up events, or temporary
            information boards where printing a URL is impractical.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          The Length-vs-Density Tradeoff
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          This is the most important consideration unique to text QR codes. Unlike URLs, which can
          be shortened before encoding, plain text cannot be compressed. Every character you add
          increases the number of data modules in the QR grid — making the code denser and harder
          for phone cameras to resolve, especially at small print sizes or in poor lighting.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The generator displays a live character counter and warns you when you exceed 500
          characters. The hard limit is 2,000 characters. Here is a practical guide to what
          density level to expect:
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Character count guidelines
        </h3>
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Length
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Density
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Minimum print size
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["< 100 chars", "Very sparse — scans in any lighting", "Any size"],
                ["100–300 chars", "Sparse — reliable across all devices", "2 × 2 cm"],
                ["300–500 chars", "Moderate — works on all modern phones", "3 × 3 cm"],
                ["500–1,000 chars", "Dense — use error correction H", "4 × 4 cm"],
                ["1,000–2,000 chars", "Very dense — test thoroughly first", "5 × 5 cm+"],
              ].map(([len, density, size]) => (
                <tr key={len}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {len}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{density}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          If your content regularly exceeds 500 characters, consider hosting it on a simple webpage
          and using a{" "}
          <Link
            href="/url-qr-code-generator"
            className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
          >
            URL QR code
          </Link>{" "}
          instead. Short URLs produce far sparser codes and let you update the content without
          reprinting.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Create a Plain Text QR Code
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          {[
            [
              "Select the Text tab",
              "It is pre-selected on this page. If you switched to another type, click the Text tab in the Content section above.",
            ],
            [
              "Type or paste your message",
              "The live character counter in the top-right of the input shows your current length. A warning appears at 500 characters.",
            ],
            [
              "Set error correction",
              "For messages over 300 characters, set error correction to H in the Customization panel. This improves reliability at the cost of a slightly denser code.",
            ],
            [
              "Preview before downloading",
              "Scan the live preview with your phone camera. Confirm the full text appears correctly — including any line breaks.",
            ],
            [
              "Download",
              "PNG for digital use, SVG for scalable print artwork, or PDF for a print-ready A4 sheet.",
            ],
          ].map(([title, desc], i) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {i + 1}
              </span>
              <span>
                <strong className="text-gray-800 dark:text-gray-200">{title}.</strong>{" "}
                {desc}
              </span>
            </li>
          ))}
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Formatting and Character Tips
        </h2>
        <ul className="mb-8 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Line breaks are preserved.</strong>{" "}
            The QR code respects newlines exactly as you type them. Use blank lines to separate
            sections and improve readability when the text is displayed.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">No markup or formatting.</strong>{" "}
            There is no bold, italic, colour, or hyperlinks. What you type is exactly what the
            scanner shows — plain text only.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Emoji cost bytes.</strong>{" "}
            Each emoji character occupies 4 bytes rather than 1, so 10 emoji consume the same
            density budget as roughly 40 plain characters. Use sparingly in longer messages.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Prefix with context.</strong>{" "}
            For messages displayed without surrounding context — on an exhibit label or product
            insert — start with a heading line: <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">INGREDIENTS:</code> or{" "}
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">INSTRUCTIONS:</code>.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Uppercase encodes more efficiently.</strong>{" "}
            QR&apos;s alphanumeric mode handles uppercase letters and digits at roughly twice the
            density efficiency of mixed-case text. For very long messages, consider using
            uppercase where it does not harm readability.
          </li>
        </ul>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Other QR code generators
          </p>
          <ul className="space-y-2 text-sm">
            {[
              ["/url-qr-code-generator", "URL QR Code Generator", "link to any website from a printed code"],
              ["/phone-qr-code-generator", "Phone Call QR Code Generator", "open the dialer instantly when scanned"],
              ["/vcard-qr-code-generator", "vCard QR Code Generator", "share your full contact details in one scan"],
              ["/location-qr-code-generator", "Location QR Code Generator", "open Maps to any address or GPS pin"],
              ["/qr-code-generator", "QR Code Generator Hub", "overview of all types and when to use each"],
            ].map(([href, label, desc]) => (
              <li key={href}>
                <Link href={href} className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                  {label}
                </Link>{" "}
                — {desc}
              </li>
            ))}
          </ul>
        </div>

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
