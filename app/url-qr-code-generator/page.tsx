import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free URL QR Code Generator — Create Custom Website QR Codes",
  description:
    "Turn any website link into a scannable QR code in seconds. Customize colors, shapes, and add your logo. Download as PNG, SVG, JPG, WebP, or PDF — 100% free, no signup.",
  alternates: {
    canonical: "https://qrcodegenerator.vercel.app/url-qr-code-generator",
  },
  openGraph: {
    title: "Free URL QR Code Generator — Create Custom Website QR Codes",
    description:
      "Turn any website link into a scannable QR code in seconds. Customize colors, shapes, and add your logo. Download as PNG, SVG, JPG, WebP, or PDF — 100% free, no signup.",
    url: "https://qrcodegenerator.vercel.app/url-qr-code-generator",
    siteName: "QR Code Generator",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I use any URL, including long URLs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can enter any valid URL, including long ones. However, longer URLs produce denser QR codes that may be harder to scan in small sizes. We recommend using a URL shortener (like bit.ly or your own domain redirect) to keep the code as simple as possible, especially if you plan to print it at small sizes.",
      },
    },
    {
      "@type": "Question",
      name: "Will the QR code expire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QR codes generated here never expire. The data is encoded directly into the image. As long as you keep the destination URL live and working, the QR code will keep scanning correctly indefinitely. If you use a URL shortener, check that the shortener service stays active.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track how many times my QR code is scanned?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not directly from this generator, since all processing happens in your browser. To track scans, use a URL with UTM parameters (e.g., ?utm_source=qr&utm_medium=print) and check your Google Analytics or equivalent dashboard. Alternatively, route the QR code to a URL shortener that provides click analytics.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best QR code size for printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A minimum of 2 × 2 cm (about 0.8 × 0.8 inches) is readable by most smartphones in good lighting. For outdoor banners or signage that will be scanned from a distance, scale up proportionally — roughly 1 cm of QR size per meter of scanning distance is a good rule of thumb.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add my logo to a URL QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Use the Logo section in the Customization panel to upload a PNG, JPG, or SVG file (max 1 MB). Keep the logo under 30% of the QR area and set error correction to H for best results, as the logo covers part of the code and error correction compensates for this.",
      },
    },
    {
      "@type": "Question",
      name: "What download formats are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can download your URL QR code as PNG (best for digital and general print), SVG (infinitely scalable vector, ideal for large-format print), JPEG (smaller file, opaque background), WebP (modern web format), or PDF (print-ready A4, centered at 140 mm).",
      },
    },
  ],
};

export default function UrlQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Generator embedded at the top for immediate use */}
      <QRGenerator defaultType="url" />

      {/* SEO content section */}
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free URL QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          The fastest way to turn any website link into a scannable QR code. Paste
          your URL above, style the code to match your brand, and download in any
          format — PNG, SVG, JPEG, WebP, or print-ready PDF. No account, no
          watermark, no data sent to a server.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Create a URL QR Code
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Generating a URL QR code with this tool takes less than a minute:
        </p>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              1
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Paste your URL</strong> into the
              Website URL field above. You can include any valid web address — homepage, product
              page, social profile, Google review link, or anything else. The{" "}
              <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">https://</code>{" "}
              prefix is added automatically if omitted.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              2
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Customise the design</strong>.
              Choose from five Quick Presets for instant branding, or manually pick foreground and
              background colors, dot shape (square, rounded, dots, extra-rounded), and corner / eye
              style. Enable a gradient for a modern look, or upload your logo for a fully branded QR.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              3
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Preview in real time</strong>.
              The QR code on the right updates instantly as you type or change settings. Test it with
              your phone camera before downloading.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              4
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Download</strong> in the format
              that fits your use case — PNG for digital, SVG for print, or PDF for immediate
              hand-off to a designer or print shop.
            </span>
          </li>
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Why Use a QR Code for Your Website?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Typing a URL is friction. A QR code eliminates it. Here are the most
          common and effective ways businesses and individuals use URL QR codes:
        </p>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Business cards and stationery.</strong>{" "}
            Replace long URLs with a clean QR code. Prospects scan and land on your portfolio,
            LinkedIn profile, or booking page in one tap.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Print advertising.</strong>{" "}
            Flyers, posters, and magazine ads can drive online traffic without forcing readers to
            type. Add UTM parameters to measure which print pieces perform best.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Product packaging.</strong>{" "}
            Link to instruction manuals, warranty registration, video demos, or reorder pages
            directly from the box.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Restaurant menus.</strong>{" "}
            A QR code on each table linking to your digital menu or online ordering system reduces
            printing costs and keeps the experience contactless.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Event signage and lanyards.</strong>{" "}
            Link to schedules, session pages, speaker bios, or feedback forms. Attendees scan as
            they walk past; no paper handouts required.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Email signatures and presentations.</strong>{" "}
            Embed a QR code that links to a demo, case study, or landing page — useful for both
            PDF exports and slide-deck handouts.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Best Practices for URL QR Codes
        </h2>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Use short or redirected URLs
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Every character in your URL adds dots to the QR code, making it denser and harder to
          scan at small sizes. Run your link through a URL shortener or create a clean redirect
          (e.g., <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">yourdomain.com/menu</code>)
          to keep the code sparse and reliable. This also lets you update the destination page
          without reprinting the QR code.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Add UTM tracking parameters
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          To measure the effectiveness of your print campaigns, append UTM parameters to your URL
          before generating the QR code. For example:{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">
            https://example.com?utm_source=flyer&amp;utm_medium=print&amp;utm_campaign=summer2025
          </code>. Your Google Analytics or Plausible dashboard will show exactly how many visitors
          came from that QR code.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Choose sufficient error correction
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Error correction allows QR codes to remain scannable even when partially obscured or
          damaged. If you are adding a logo, select error correction level H (30% redundancy).
          For plain URL codes without a logo, level M (15%) balances data density and resilience.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Maintain adequate contrast
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          QR scanners rely on the contrast between dark dots and a light background. A dark-on-light
          color combination always works best. Inverted (light-on-dark) codes can scan fine on
          screen but may fail on some paper finishes. Test both directions before going to print.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Always test before large-scale printing
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Scan the downloaded QR code on at least two different devices (iOS and Android) before
          sending to the printer. Check that the landing page loads correctly over mobile data, not
          just Wi-Fi. A broken link on 5,000 flyers is an expensive mistake.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Download Formats Explained
        </h2>
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Format
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["PNG", "Digital use, email, web, general print"],
                ["SVG", "Large-format print, logos, scalable artwork"],
                ["JPEG", "Web embeds where smaller file size matters"],
                ["WebP", "Modern web, faster page loads"],
                ["PDF", "Print-ready A4, hand-off to designers/printers"],
              ].map(([fmt, use]) => (
                <tr key={fmt}>
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {fmt}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Other QR code generators
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/phone-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                Phone Call QR Code Generator
              </Link>{" "}
              — encode a phone number so scanners open the dialer instantly
            </li>
            <li>
              <Link
                href="/vcard-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                vCard QR Code Generator
              </Link>{" "}
              — share your full contact details in one scan
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
    </main>
  );
}
