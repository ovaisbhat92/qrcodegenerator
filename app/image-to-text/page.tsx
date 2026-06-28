import type { Metadata } from "next";
import ImageToTextTool from "@/components/ImageToTextTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Image to Text Converter — Extract Text from Images Online",
  description:
    "Upload any image and extract text instantly using free OCR. Works with photos, screenshots, scanned documents, and more. 100% private — processed in your browser.",
  alternates: { canonical: "https://www.freeqrcodemaker.in/image-to-text" },
  openGraph: {
    title: "Free Image to Text Converter — Extract Text from Images Online",
    description:
      "Upload any image and extract text instantly using free OCR. Works with photos, screenshots, scanned documents, and more. 100% private — processed in your browser.",
    url: "https://www.freeqrcodemaker.in/image-to-text",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.freeqrcodemaker.in" },
    { "@type": "ListItem", position: 2, name: "Image to Text", item: "https://www.freeqrcodemaker.in/image-to-text" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What image formats does the converter support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The converter supports JPG, JPEG, PNG, WEBP, BMP, and GIF images up to 10 MB in size.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All OCR processing happens entirely in your browser using Tesseract.js. Your image never leaves your device and is never sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the text extraction?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accuracy depends on image quality, font clarity, and contrast. High-resolution images with clear, dark text on a light background give the best results. Handwritten or decorative fonts may have lower accuracy.",
      },
    },
    {
      "@type": "Question",
      name: "Can I create a QR code from the extracted text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After text is extracted, click the 'Create QR Code' button to open the QR code generator with your text pre-filled and ready to encode.",
      },
    },
    {
      "@type": "Question",
      name: "What languages does the OCR support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The current version uses the English language pack from Tesseract.js. It works best with English text but can handle Latin-script languages with reasonable accuracy.",
      },
    },
  ],
};

export default function ImageToTextPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="gradient-text text-4xl font-extrabold lg:text-5xl"
            style={{ letterSpacing: "-0.5px" }}
          >
            Image to Text Converter
          </h1>
          <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
            Extract text from any image instantly — free, accurate, and 100% private.
          </p>
        </div>

        {/* Tool */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <ImageToTextTool />
        </div>

        {/* Article content */}
        <article
          className="prose prose-invert mt-12 max-w-none"
          style={{ color: "var(--text-secondary)" }}
        >
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            Free Online Image to Text Converter
          </h2>
          <p>
            Our image to text converter uses Optical Character Recognition (OCR) technology to read
            and extract text from photos, screenshots, scanned documents, and other image files —
            entirely within your browser. No uploads, no accounts, no waiting. Just paste or drag an
            image and get the text in seconds.
          </p>

          <h2 className="mt-8 text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            How It Works
          </h2>
          <p>
            Upload any supported image (JPG, PNG, WEBP, BMP, or GIF up to 10 MB). The tool uses{" "}
            <strong>Tesseract.js</strong>, an open-source OCR engine running directly in your browser,
            to analyze the image pixel by pixel and identify characters. The recognized text appears in
            an editable text area where you can review, correct, copy, or download it.
          </p>
          <p>
            Because everything runs locally in your browser, your image data never reaches our servers.
            This makes it safe to use with sensitive documents, personal photos, or confidential
            business materials.
          </p>

          <h2 className="mt-8 text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            What Can You Extract Text From?
          </h2>
          <ul style={{ color: "var(--text-secondary)" }}>
            <li><strong>Screenshots</strong> — Capture text from websites, apps, or desktop windows you cannot copy directly.</li>
            <li><strong>Scanned documents</strong> — Convert scanned PDFs saved as images into editable text.</li>
            <li><strong>Photos of books or printed materials</strong> — Digitize printed text without retyping.</li>
            <li><strong>Receipts and invoices</strong> — Extract totals, dates, and line items from receipt images.</li>
            <li><strong>Business cards</strong> — Grab name, phone, and email from a business card photo.</li>
            <li><strong>Whiteboards and notes</strong> — Convert handwritten or marker text (printed style works best).</li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            Tips for Best OCR Results
          </h2>
          <ul style={{ color: "var(--text-secondary)" }}>
            <li>Use high-resolution images — the higher the DPI, the better the accuracy.</li>
            <li>Ensure good contrast between text and background (black on white is ideal).</li>
            <li>Avoid skewed or rotated images where possible — straighten them before uploading.</li>
            <li>Standard printed fonts produce much better results than decorative or handwritten text.</li>
            <li>Crop the image to only the text area to reduce noise and improve recognition speed.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            From Image to QR Code in Two Clicks
          </h2>
          <p>
            Once text is extracted, you can instantly convert it into a QR code. Click the{" "}
            <strong>Create QR Code</strong> button and the text is sent to our{" "}
            <Link href="/text-qr-code-generator" style={{ color: "#06b6d4" }}>
              text QR code generator
            </Link>{" "}
            where you can customize colors, add a logo, and download in PNG, SVG, JPEG, or PDF.
            This workflow is useful for creating QR codes from printed materials, book passages, or
            long quotes without manual retyping.
          </p>

          {/* FAQs */}
          <h2 className="mt-8 text-2xl font-bold" style={{ color: "var(--text-secondary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-3">
            {faqSchema.mainEntity.map((faq) => (
              <details
                key={faq.name}
                className="rounded-xl p-4"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              >
                <summary
                  className="cursor-pointer font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {faq.name}
                </summary>
                <p className="mt-2 text-sm" style={{ color: "var(--text-hint)" }}>
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>

          {/* Internal links */}
          <div
            className="mt-10 rounded-xl p-5"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <p className="mb-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
              More free tools
            </p>
            <ul className="space-y-1 text-sm" style={{ color: "#06b6d4" }}>
              <li><Link href="/qr-code-generator">Free QR Code Generator</Link></li>
              <li><Link href="/text-qr-code-generator">Text QR Code Generator</Link></li>
              <li><Link href="/url-qr-code-generator">URL QR Code Generator</Link></li>
              <li><Link href="/qr-code-scanner">QR Code Scanner</Link></li>
              <li><Link href="/bulk-qr-generator">Bulk QR Code Generator</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
