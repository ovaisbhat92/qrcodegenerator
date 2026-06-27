import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free QR Code Generator — Create Custom QR Codes for Any Purpose",
  description:
    "Create free custom QR codes for websites, text, phone numbers, contacts, and locations. Customize colors, add a logo, download PNG, SVG, JPEG, WebP, or PDF. No signup, no watermarks.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/qr-code-generator",
  },
  openGraph: {
    title: "Free QR Code Generator — Create Custom QR Codes for Any Purpose",
    description:
      "Create free custom QR codes for websites, text, phone numbers, contacts, and locations. Customize colors, add a logo, download PNG, SVG, JPEG, WebP, or PDF. No signup, no watermarks.",
    url: "https://www.freeqrcodemaker.in/qr-code-generator",
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
      name: "What types of QR codes can I create with this generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can create five types: URL (opens a website), Text (displays a plain-text message), Phone (opens the dialer for a call), vCard (saves a full contact to the phone), and Location (opens a maps app to an address or GPS coordinates). Each type is purpose-built and produces a leaner QR code than encoding the equivalent data as plain text.",
      },
    },
    {
      "@type": "Question",
      name: "Are QR codes generated here free to use commercially?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QR codes are an open standard (ISO/IEC 18004) and the codes you generate are yours to use for any purpose, including commercial print runs, product packaging, marketing materials, and signage. There are no royalties, no watermarks, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Do QR codes expire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The QR codes generated here are static — the data is encoded permanently inside the image. They will keep scanning correctly for as long as the printed or digital code remains legible. The one exception is URL codes: if the destination URL goes offline or redirects elsewhere, the scan will still work but the page it lands on may not. This is a property of the URL, not the QR code.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit a QR code after downloading it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A static QR code is a fixed image — changing the encoded data requires generating a new code. If you need to update the destination (e.g., a URL changes), you have two options: regenerate and reprint the QR code, or use a URL shortener or redirect that you control, so you can change the destination without changing the QR code.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a static and a dynamic QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A static QR code encodes data directly in the image — the content is fixed and cannot be changed after printing. A dynamic QR code encodes a short URL that redirects to a changeable destination, allowing you to update the content, track scan counts, and add analytics. This generator creates static QR codes, which are simpler, work without a server, and never expire. For scan tracking and updateable content, consider pairing a static URL QR code with a URL shortener that offers analytics.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private when using this generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All QR code generation happens locally in your browser using the qr-code-styling library. Your URL, text, phone number, contact information, and location data never leave your device and are never transmitted to any server. There are no usage logs, no analytics on your content, and no account required.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create a QR Code",
  description:
    "Generate a free, custom QR code for any purpose in under a minute — no signup required.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose a QR code type",
      text: "Select the content type that matches your use case: URL for websites, Text for plain messages, Phone for a call number, vCard for full contact details, or Location for a map pin.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your content",
      text: "Fill in the relevant field: paste a URL, type your message, enter a phone number, complete the contact form, or provide GPS coordinates or a Google Maps share link.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Customise the design",
      text: "Adjust colors, dot style, corner style, size, and error correction level. Optionally upload a logo and choose a quick design preset for instant branded styling.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Preview and test",
      text: "Scan the live preview with your phone camera to confirm the QR code opens the correct content before downloading.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Download your QR code",
      text: "Click the download button for your preferred format: PNG for digital use, SVG for scalable print artwork, JPEG or WebP for web images, or PDF for a print-ready A4 sheet.",
    },
  ],
};

const QR_TYPES = [
  {
    href: "/url-qr-code-generator",
    icon: "🔗",
    type: "URL",
    tagline: "Open a website",
    description:
      "Ideal for marketing materials, product packaging, restaurant menus, business cards, and any printed surface that needs to link to a web page.",
  },
  {
    href: "/text-qr-code-generator",
    icon: "📝",
    type: "Text",
    tagline: "Display a message",
    description:
      "Best for notes, instructions, exhibit labels, recipes, and any content where there is no URL — the text appears directly on screen when scanned.",
  },
  {
    href: "/phone-qr-code-generator",
    icon: "📞",
    type: "Phone",
    tagline: "Open the dialer",
    description:
      "Encodes a telephone number as a tel: URI. Scanning opens the native phone dialer with the number pre-filled — one tap to call. Great for business cards and signage.",
  },
  {
    href: "/vcard-qr-code-generator",
    icon: "👤",
    type: "vCard",
    tagline: "Save a contact",
    description:
      "Encodes name, phone, email, company, job title, website, and address in the vCard 3.0 standard. Scanning prompts the phone to save the full contact instantly.",
  },
  {
    href: "/location-qr-code-generator",
    icon: "📍",
    type: "Location",
    tagline: "Open Maps",
    description:
      "Encodes a Google Maps link or GPS coordinates. Scanning opens the maps app directly to the location — ideal for event signage, real estate signs, and wayfinding.",
  },
];

export default function QRCodeGeneratorHubPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultType="url" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Create a custom QR code for any purpose in seconds. Choose a content type, enter your
          data, style the design to match your brand, and download in any format — PNG, SVG, JPEG,
          WebP, or print-ready PDF. All processing happens in your browser: nothing is saved, no
          account required, and the codes are yours to use freely.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          What Is a QR Code?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          A QR code (Quick Response code) is a two-dimensional matrix barcode that a smartphone
          camera can read in under a second. Developed by Denso Wave in 1994 for tracking
          automotive parts, the format became a universal consumer technology after Apple and
          Android added native QR scanning to their camera apps in 2017. Today, every modern
          smartphone can scan a QR code without installing any third-party app.
        </p>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Unlike a one-dimensional barcode that stores a dozen digits, a QR code can encode up to
          4,296 alphanumeric characters — enough for a full URL, a contact card, or a paragraph of
          text. The pattern of black and white modules also includes error correction: even if up to
          30% of the code is obscured, dirty, or damaged, it remains scannable. This makes QR codes
          robust for real-world print applications where perfect conditions cannot be guaranteed.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Choose the Right QR Code Type
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Each QR type encodes data differently and triggers a specific action when scanned. Pick
          the type that matches what you want the scan to do:
        </p>
        <div className="mb-8 grid gap-4 sm:grid-cols-1">
          {QR_TYPES.map(({ href, icon, type, tagline, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400">
                  {type} QR Code{" "}
                  <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                    — {tagline}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          What You Can Customise
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Every QR code generated here can be fully styled to match your brand or aesthetic. The
          customisation panel above the fold offers:
        </p>
        <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Colors.</strong>{" "}
            Set independent foreground and background colors, or enable a linear or radial gradient
            across the dot pattern for a modern look.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Dot style.</strong>{" "}
            Square, rounded, dots, or extra-rounded — each option creates a distinct visual
            character while remaining fully scannable.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Corner style.</strong>{" "}
            The three finder squares (the large corner marks) can be styled independently as
            square, rounded, or circle.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Size and margin.</strong>{" "}
            Generate at any resolution from 128 to 1,024 px, with an adjustable quiet-zone margin.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Error correction.</strong>{" "}
            Four levels: L (7%), M (15%), Q (25%), H (30%). Higher levels allow more logo coverage
            or physical damage while keeping the code scannable.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Logo.</strong>{" "}
            Upload a PNG, JPG, or SVG (max 1 MB) to embed in the centre of the code. Use error
            correction H when adding a logo.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Quick presets.</strong>{" "}
            Five one-click design presets — Classic, Blue Business, Green Payment, Purple Social,
            and Minimal Grey — for instant branded styling.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Download Formats
        </h2>
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
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
                ["PNG", "Digital use, email attachments, presentations, general print"],
                ["SVG", "Large-format print, billboards, scalable brand assets"],
                ["JPEG", "Web embeds where a smaller file size matters more than transparency"],
                ["WebP", "Modern web pages — smaller than PNG/JPEG with similar quality"],
                ["PDF", "Print-ready A4 document, centered at 140 mm — hand off directly to a printer"],
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

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Privacy and Browser-Side Processing
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          This tool runs entirely in your browser using the open-source qr-code-styling library.
          Your URLs, text messages, phone numbers, contact details, and location data never leave
          your device. There are no server requests, no usage logs, no account, and no third-party
          analytics tracking your content. The QR code image is generated locally and downloaded
          directly from your browser to your device.
        </p>

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </main>
  );
}
