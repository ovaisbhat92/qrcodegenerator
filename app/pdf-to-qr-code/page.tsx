import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free PDF to QR Code Generator — Convert Document Text to QR Code",
  description:
    "Extract text from any PDF and convert it into a scannable QR code — all inside your browser. Share document summaries, key excerpts, or contact details in one scan.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/pdf-to-qr-code",
  },
  openGraph: {
    title: "Free PDF to QR Code Generator — Convert Document Text to QR Code",
    description:
      "Extract text from any PDF and convert it into a scannable QR code — all inside your browser. Share document summaries, key excerpts, or contact details in one scan.",
    url: "https://www.freeqrcodemaker.in/pdf-to-qr-code",
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
    { "@type": "ListItem", position: 3, name: "PDF to QR Code", item: "https://www.freeqrcodemaker.in/pdf-to-qr-code" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does my PDF get uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. PDF text extraction uses Mozilla's PDF.js library running entirely in your browser via WebAssembly. Your PDF file never leaves your device — no data is sent to our servers or any third-party service.",
      },
    },
    {
      "@type": "Question",
      name: "Why can't I encode my entire PDF in a QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QR codes have a practical character limit. While the technical maximum for binary data is around 2,900 characters, keeping payloads under 800 characters ensures the QR code remains reliably scannable across all devices and print sizes. Longer payloads create extremely dense codes that many phone cameras struggle to read, especially when printed small.",
      },
    },
    {
      "@type": "Question",
      name: "Will this work on scanned PDFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. PDF.js extracts the text layer embedded in digital PDFs. Scanned PDFs are essentially images of pages — they contain no machine-readable text layer, so extraction will return empty results. For scanned PDFs, use the Image → QR tool to upload a screenshot of a page and run OCR on it instead.",
      },
    },
    {
      "@type": "Question",
      name: "Can I choose which pages of the PDF to extract from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. For PDFs with more than one page, the tool shows a page selector with three options: All pages (concatenates text from every page), Page 1 only, or Pages 1–2. This lets you focus the QR code on the most relevant part of your document without having to manually cut down a very long text.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best use cases for PDF-to-QR conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common use cases include: encoding the abstract or key findings from a research paper so conference attendees can scan and save it; sharing the contact page or key address from a multi-page brochure; providing a quick summary of a policy document or terms of service; distributing coupon codes, event details, or terms from a PDF flyer; and encoding the table of contents or chapter summaries from a report.",
      },
    },
  ],
};

export default function PdfToQRCodePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultType="pdf-text" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free PDF to QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Upload a PDF and instantly extract its text content. Edit and trim it, then generate a
          fully customisable QR code that anyone can scan to read the key information. Everything
          runs in your browser — your document is never uploaded to a server.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Convert PDF Text to a QR Code
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">1</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Select the PDF → QR tab</strong> and
              drag or click to upload your PDF (max 10 MB). The tool only accepts digital PDFs with
              a text layer — scanned image PDFs will not produce results.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">2</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Choose your page range.</strong>{" "}
              For multi-page PDFs, select All pages, Page 1 only, or Pages 1–2 to control how much
              text is extracted.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">3</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Edit the extracted text.</strong>{" "}
              The text appears in an editable area. Remove boilerplate, headers, and anything
              non-essential. Aim for under 800 characters for maximum scan reliability.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">4</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Customise and download.</strong>{" "}
              Style your QR code with custom colours, dot shapes, and optional logo, then download
              in PNG, SVG, JPEG, WebP, or PDF format.
            </span>
          </li>
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Use Cases
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Research and academic papers.</strong>{" "}
            Encode the abstract, key findings, or citation of a paper as a QR code for conference
            posters, so attendees can scan and save the reference without typing.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Marketing brochures.</strong>{" "}
            Extract the key offer, pricing, or call-to-action text from a multi-page brochure
            and encode it as a QR code for quick sharing.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Legal and policy documents.</strong>{" "}
            Share a plain-language summary of terms and conditions, privacy policies, or
            warranty documents by encoding the key points as a QR code on product packaging.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Event programs and schedules.</strong>{" "}
            Convert a PDF event agenda into a QR code that attendees can scan to get the
            schedule without carrying a physical printout.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Contact details from PDFs.</strong>{" "}
            Many CV and proposal PDFs include contact information. Extract the name, phone,
            and email, paste them into the vCard QR type, and generate a contact QR code.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Understanding QR Code Character Limits
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          QR codes encode data as a pattern of black and white squares. The more data you
          encode, the more squares are needed, and the smaller and denser each square becomes.
          At small print sizes, dense codes may fail to scan on some phones.
        </p>
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Characters</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["Under 200", "Very sparse, scans from a distance, ideal for small print"],
                ["200–500", "Good density, reliable on all devices and sizes"],
                ["500–800", "Moderate density, works well at A4/business card sizes"],
                ["800–1500", "Dense — use only for digital display, not small print"],
                ["Over 1500", "Too dense for reliable scanning — trim further"],
              ].map(([chars, result]) => (
                <tr key={chars}>
                  <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400">{chars}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Tips for Best Results
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Extract only what you need.</strong>{" "}
            Don&apos;t encode an entire document. Identify the one or two paragraphs that matter
            most and delete the rest in the editable textarea.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Remove formatting noise.</strong>{" "}
            PDF extraction sometimes produces extra spaces, line breaks, or header/footer text.
            Clean these up before generating the QR code.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Use high error correction.</strong>{" "}
            The default error correction level is H (30% redundancy), which makes the code
            more resilient to minor damage or smudging. Keep this setting for printed codes.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Test before printing.</strong>{" "}
            Scan the downloaded QR code on at least two different phones before printing at
            scale. Dense codes sometimes fail on older devices.
          </li>
        </ul>

        {/* Internal links */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Related tools
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/image-to-qr-code" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                Image to QR Code Generator
              </Link>{" "}
              — extract text from photos and images using OCR
            </li>
            <li>
              <Link href="/text-qr-code-generator" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                Plain Text QR Code Generator
              </Link>{" "}
              — encode any text directly without file upload
            </li>
            <li>
              <Link href="/qr-code-generator" className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400">
                QR Code Generator Hub
              </Link>{" "}
              — see all available QR code types
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
