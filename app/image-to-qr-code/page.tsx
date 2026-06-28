import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free Image to QR Code Generator — Extract & Convert Text from Images",
  description:
    "Upload any image and our browser-based OCR instantly extracts the text, which you can then convert into a scannable QR code. 100% free, no signup, fully private.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/image-to-qr-code",
  },
  openGraph: {
    title: "Free Image to QR Code Generator — Extract & Convert Text from Images",
    description:
      "Upload any image and our browser-based OCR instantly extracts the text, which you can then convert into a scannable QR code. 100% free, no signup, fully private.",
    url: "https://www.freeqrcodemaker.in/image-to-qr-code",
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
    { "@type": "ListItem", position: 3, name: "Image to QR Code", item: "https://www.freeqrcodemaker.in/image-to-qr-code" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What file formats can I upload for OCR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can upload PNG, JPG, JPEG, WEBP, BMP, and GIF images up to 5 MB. For best OCR results, use PNG or JPG images with clear, high-contrast text on a plain background.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. OCR processing happens entirely in your browser using Tesseract.js, an open-source OCR engine compiled to WebAssembly. Your image never leaves your device — no server receives or stores it.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the text extraction?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accuracy depends on image quality. Printed text on a white background with high contrast typically achieves 95%+ accuracy. Handwritten text, decorative fonts, low-resolution scans, or images with busy backgrounds will have lower accuracy. Always review and edit the extracted text before generating the QR code.",
      },
    },
    {
      "@type": "Question",
      name: "Why is there a 800-character warning for the QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QR codes encode data as a grid of black and white dots. The more text you encode, the denser and smaller those dots become, making the code harder for phones to scan — especially at small print sizes. Keeping your payload under 800 characters ensures the QR code remains reliably scannable. You can edit the extracted text to keep only the essential information.",
      },
    },
    {
      "@type": "Question",
      name: "What are good use cases for image-to-QR conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common use cases include: converting street signs or menu boards into QR codes for sharing, turning receipts or business cards into digital QR codes, extracting and sharing handwritten notes or whiteboard text, converting signage in photos taken at events or exhibitions, and creating QR codes from scanned labels or product descriptions.",
      },
    },
  ],
};

export default function ImageToQRCodePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultType="image-ocr" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free Image to QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Upload any image containing text — a photo of a sign, a scanned label, a receipt, or a
          handwritten note — and our browser-based OCR engine extracts the text instantly. Review
          and edit it, then generate a fully customisable QR code. No account, no upload to any
          server, no watermark.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How It Works
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The tool uses <strong className="text-gray-800 dark:text-gray-200">Tesseract.js</strong>,
          a port of Google&apos;s open-source Tesseract OCR engine compiled to WebAssembly. It runs
          completely inside your browser — the image is never sent to a server. Here&apos;s the process:
        </p>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">1</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Select the Image → QR tab</strong> and drag
              or click to upload your image (PNG, JPG, WEBP, BMP, or GIF; max 5 MB).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">2</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Wait for OCR to complete.</strong>{" "}
              The engine analyses the image and fills in an editable text area with the extracted
              content. This typically takes 2–10 seconds depending on image size.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">3</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Review and trim the text.</strong>{" "}
              OCR is not perfect — check for errors and remove anything irrelevant. Keep it under
              800 characters for the most reliable QR code.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">4</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Customise and download.</strong>{" "}
              Use the Customisation panel to change colours, dot style, and add a logo, then
              download as PNG, SVG, JPEG, WebP, or PDF.
            </span>
          </li>
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Use Cases
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Street signs and notices.</strong>{" "}
            Photograph a public notice or event poster and encode its key text as a QR code to share
            with others who weren&apos;t there.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Receipts and invoices.</strong>{" "}
            Snap a photo of a receipt, extract the vendor name and reference number, and encode it
            as a QR code for quick retrieval.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Handwritten notes and whiteboards.</strong>{" "}
            Convert a photo of meeting notes or a whiteboard into a shareable QR code that anyone
            can scan to read the content.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Product labels and packaging.</strong>{" "}
            Extract ingredient lists, serial numbers, or instructions from product photos and
            re-encode them as a QR code for digital archiving.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Business cards.</strong>{" "}
            Photograph a printed business card, extract the contact details, and then use the vCard
            QR type to encode them in a standard contact format.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Tips for Best OCR Results
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Use high contrast.</strong>{" "}
            Dark text on a white or light background gives the highest accuracy. Coloured backgrounds
            reduce OCR reliability.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Take sharp, well-lit photos.</strong>{" "}
            Blurry or low-light images produce significant errors. Use your phone&apos;s HDR mode and
            make sure text is in focus.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Avoid perspective distortion.</strong>{" "}
            Photograph text from directly above or head-on. Angled shots reduce accuracy. Crop
            the image to the text area before uploading.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Prefer standard fonts.</strong>{" "}
            Printed, sans-serif text (Arial, Helvetica, Roboto) is recognised almost perfectly.
            Decorative, script, or display fonts may cause errors.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Always review the output.</strong>{" "}
            Even with ideal conditions, OCR makes occasional mistakes. Read through the extracted
            text and correct any errors before generating the QR code.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Privacy
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Your image is processed entirely within your browser. Tesseract.js is downloaded once
          and runs locally — nothing is uploaded to our servers or any third-party service. The QR
          code is also generated client-side, so the extracted text never leaves your device.
        </p>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Related tools
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/pdf-to-qr-code" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                PDF to QR Code Generator
              </Link>{" "}
              — extract and encode text from PDF documents
            </li>
            <li>
              <Link href="/text-qr-code-generator" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                Plain Text QR Code Generator
              </Link>{" "}
              — encode any text directly without OCR
            </li>
            <li>
              <Link href="/qr-code-generator" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                QR Code Generator Hub
              </Link>{" "}
              — overview of all QR types available
            </li>
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
