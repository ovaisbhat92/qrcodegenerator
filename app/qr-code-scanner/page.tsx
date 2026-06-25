import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free QR Code Scanner — Scan QR Codes Online Without an App",
  description:
    "Scan QR codes online directly in your browser — upload an image or use your camera. No app, no signup, 100% free. Decodes URLs, text, UPI, vCard, and more. Works on mobile and desktop.",
  alternates: {
    canonical: "https://qrcodegenerator.space/qr-code-scanner",
  },
  openGraph: {
    title: "Free QR Code Scanner — Scan QR Codes Online Without an App",
    description:
      "Scan QR codes online directly in your browser — upload an image or use your camera. No app, no signup, 100% free. Decodes URLs, text, UPI, vCard, and more. Works on mobile and desktop.",
    url: "https://qrcodegenerator.space/qr-code-scanner",
    siteName: "QR Code Generator",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://qrcodegenerator.space/" },
    { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://qrcodegenerator.space/qr-code-generator" },
    { "@type": "ListItem", position: 3, name: "QR Code Scanner", item: "https://qrcodegenerator.space/qr-code-scanner" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I scan a QR code from a screenshot or image file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Switch to the Upload Image tab, click the upload button, and select any PNG, JPG, WebP, or GIF file from your device — including screenshots. The scanner will decode the QR code directly from the image file without needing to point a camera at a physical code. This is especially useful for QR codes received in emails, documents, PDFs (take a screenshot first), or messaging apps.",
      },
    },
    {
      "@type": "Question",
      name: "Does this QR code scanner work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Both methods work on mobile browsers. The Camera mode requests access to your rear (environment-facing) camera and scans in real time. The Upload mode lets you pick an image from your photo library. On iOS, Safari and Chrome both support the required APIs. On Android, Chrome and most modern browsers work without any issues.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All decoding is done entirely in your browser using the open-source jsQR library. Your image file and camera feed never leave your device — there are no server requests and no data is stored or logged. You can confirm this by enabling airplane mode after the page loads: the scanner still works.",
      },
    },
    {
      "@type": "Question",
      name: "What if the QR code is blurry or damaged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QR codes include built-in error correction that allows them to remain readable even when up to 30% of the code is obscured, dirty, or damaged. For best results with the image upload method, use the highest resolution version of the image available. For camera scanning, ensure even lighting with no glare, hold the camera steady, and make sure the entire QR code is visible in the frame.",
      },
    },
    {
      "@type": "Question",
      name: "What types of QR codes can this scanner read?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This scanner decodes any standard QR code regardless of what was used to generate it. Common content types include: URLs (websites), plain text, UPI payment links, vCard contact cards, phone numbers (tel: links), email addresses (mailto: links), Wi-Fi credentials, and geographic coordinates. After decoding, URLs are shown as clickable links; all other content is shown as plain text with a copy button.",
      },
    },
  ],
};

export default function QRCodeScannerPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultMode="scan" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free QR Code Scanner
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Decode any QR code directly in your browser — no app to install, no account required.
          Upload an image file or use your device&apos;s camera. Results appear instantly, and nothing
          is ever sent to a server. Works on desktop, tablet, and mobile.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Scan a QR Code Online
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          {[
            ["Choose a method", "Select Upload Image to decode a QR code from a file, or Use Camera to scan a physical code using your webcam or phone camera."],
            ["Upload or point camera", "For Upload: click the upload area and choose a PNG, JPG, WebP, or GIF. For Camera: click Start Camera, grant permission, and point at the QR code."],
            ["Read the result", "The decoded content appears immediately. If it's a URL, you can open it directly. For any content, use the Copy button or click Generate QR to create a new QR code from it."],
          ].map(([title, desc], i) => (
            <li key={title as string} className="flex gap-3">
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
          When You Need a Browser-Based QR Scanner
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Scanning a QR code on your computer screen.</strong>{" "}
            You can&apos;t point your phone at your own monitor. The upload method lets you take a
            screenshot and decode it instantly — no second device needed.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">QR codes received in emails or documents.</strong>{" "}
            Save the image, upload it here, and get the decoded content in one step.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Verifying a QR code before printing.</strong>{" "}
            After generating a QR code, upload the downloaded file back into the scanner to confirm
            the encoded content is exactly what you intended.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Devices without a QR scanner app.</strong>{" "}
            Older phones or shared workstations may not have a dedicated scanner. This tool runs in
            any modern browser with no installation required.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Privacy-conscious scanning.</strong>{" "}
            Unlike many QR scanner apps, this tool does not log what you scan, does not request
            location permission, and does not upload your images anywhere.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          What QR Codes Can Contain
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          QR codes are a format — they carry encoded text. The meaning of that text depends on what
          was encoded. Common content types include:
        </p>
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Content type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["URL", "https://example.com"],
                ["Plain text", "Meeting at 3pm, Room 4B"],
                ["UPI payment", "upi://pay?pa=name@upi&pn=Shop"],
                ["Phone number", "tel:+919876543210"],
                ["vCard contact", "BEGIN:VCARD…"],
                ["Wi-Fi credentials", "WIFI:S:MyNetwork;T:WPA;P:password;;"],
                ["Geographic location", "geo:28.6139,77.2090"],
              ].map(([type, ex]) => (
                <tr key={type}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Tips for Better Scan Results
        </h2>
        <ul className="mb-8 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Use the highest resolution image available.</strong>{" "}
            A 500 × 500 px image scans more reliably than a heavily compressed thumbnail.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Ensure the entire QR code is in frame.</strong>{" "}
            Cropping off even one corner of the finder pattern (the three large squares) can prevent decoding.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Avoid glare and shadows in camera mode.</strong>{" "}
            Diffuse lighting works better than direct sunlight or a single bright lamp shining on the code.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Try increasing brightness for dark images.</strong>{" "}
            If an upload fails to decode, open the image in any photo editor, increase brightness and contrast, then re-upload.
          </li>
        </ul>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            QR code generators
          </p>
          <ul className="space-y-2 text-sm">
            {[
              ["/qr-code-generator", "QR Code Generator Hub", "generate QR codes for any purpose"],
              ["/url-qr-code-generator", "URL QR Code Generator", "turn any website link into a scannable code"],
              ["/upi-qr-code-generator", "UPI QR Code Generator", "create a payment QR code for your UPI ID"],
              ["/vcard-qr-code-generator", "vCard QR Code Generator", "share contact details in one scan"],
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
