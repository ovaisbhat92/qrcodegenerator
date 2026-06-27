import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free UPI QR Code Generator — Accept Payments Instantly",
  description:
    "Generate a free UPI QR code for your UPI ID in seconds. Works with PhonePe, Google Pay, Paytm, BHIM, and all UPI apps. Customize colors, download PNG or SVG — no signup, no fees.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/upi-qr-code-generator",
  },
  openGraph: {
    title: "Free UPI QR Code Generator — Accept Payments Instantly",
    description:
      "Generate a free UPI QR code for your UPI ID in seconds. Works with PhonePe, Google Pay, Paytm, BHIM, and all UPI apps. Customize colors, download PNG or SVG — no signup, no fees.",
    url: "https://www.freeqrcodemaker.in/upi-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "UPI QR Code Generator", item: "https://www.freeqrcodemaker.in/upi-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does this UPI QR code work with PhonePe, Google Pay, and Paytm?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This generator produces a standard UPI deep-link (upi://pay?...) which is the same format used by all UPI-compliant apps including PhonePe, Google Pay (GPay), Paytm, BHIM, Amazon Pay, and every bank's own UPI app. Any app that supports UPI payments will be able to scan and process the QR code.",
      },
    },
    {
      "@type": "Question",
      name: "Should I set a fixed amount or leave it blank?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your use case. For a shop counter or freelancer invoice, leave the amount blank so the payer can enter the correct amount themselves — this is the most flexible option. For donations, fundraisers, or fixed-price items, pre-filling the amount reduces friction and prevents the payer from accidentally entering the wrong sum. A fixed-amount QR code is also useful for splitting bills at a specific value.",
      },
    },
    {
      "@type": "Question",
      name: "Is my UPI ID safe — is it stored anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your UPI ID is never sent to any server. All QR code generation happens locally in your browser using JavaScript. No data leaves your device. The QR image is generated and downloaded entirely client-side. You can verify this by disconnecting from the internet after loading the page — the generator still works.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for my shop or business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Print the QR code at your counter, add it to invoices or receipts, or display it on a standee — customers scan it with any UPI app to pay instantly. There is no transaction fee charged by this tool (standard UPI transaction rules between banks apply). The QR code is a static image and does not expire as long as your UPI ID remains active.",
      },
    },
    {
      "@type": "Question",
      name: "What is the UPI QR code format?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A UPI QR code encodes a URI in the format: upi://pay?pa={UPI_ID}&pn={Payee_Name}&am={Amount}&cu=INR&tn={Note}. The pa (payee address) field is your UPI ID, pn is the display name, am is the optional amount in INR, cu is the currency (always INR for UPI), and tn is an optional transaction note. When scanned, a UPI-compatible app reads this URI and opens the payment confirmation screen pre-filled with the details.",
      },
    },
  ],
};

export default function UpiQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <QRGenerator defaultType="upi" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Free UPI QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Create a UPI QR code for your UPI ID in seconds. Enter your UPI address, add a payee name,
          set an optional amount, and download a high-resolution QR code that works with every UPI
          app in India — PhonePe, Google Pay, Paytm, BHIM, and more. All processing happens in your
          browser: your UPI ID is never transmitted to any server.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How UPI QR Codes Work
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          UPI (Unified Payments Interface) is India&apos;s real-time interbank payment system governed
          by the National Payments Corporation of India (NPCI). Every UPI user has a VPA (Virtual
          Payment Address), also called a UPI ID — typically in the format{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">name@bankname</code>{" "}
          or <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">mobilenumber@upi</code>.
        </p>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          A UPI QR code encodes a standard URI — for example:{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">
            upi://pay?pa=name@okaxis&amp;pn=My+Shop&amp;cu=INR
          </code>.
          When a payer scans the code with any UPI app, the app reads the URI and opens a
          pre-filled payment screen. The payer confirms and the money transfers instantly via the
          UPI network — no card details, no bank login required.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Which Apps Can Scan This QR Code?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Any app that supports the standard UPI deep-link protocol can read the QR code generated
          here. This includes:
        </p>
        <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-800 dark:text-gray-200">PhonePe</strong> — India&apos;s most widely used UPI app</li>
          <li><strong className="text-gray-800 dark:text-gray-200">Google Pay (GPay)</strong> — works on Android and iOS</li>
          <li><strong className="text-gray-800 dark:text-gray-200">Paytm</strong> — supports both UPI and wallet payments</li>
          <li><strong className="text-gray-800 dark:text-gray-200">BHIM</strong> — the NPCI&apos;s official UPI reference app</li>
          <li><strong className="text-gray-800 dark:text-gray-200">Amazon Pay</strong></li>
          <li><strong className="text-gray-800 dark:text-gray-200">All bank UPI apps</strong> — SBI Pay, iMobile Pay (ICICI), Kotak Pay, Axis Mobile, and others</li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Use Cases
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Retail shops and street vendors.</strong>{" "}
            Print the QR code at your counter. Customers scan and pay directly — no POS terminal,
            no card swipe, no cash handling required.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Freelancers and consultants.</strong>{" "}
            Add a UPI QR code to your invoice PDF so clients can pay with one scan instead of
            copying account numbers.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Events and fundraisers.</strong>{" "}
            Display a QR code at registration desks or donation booths. Set a fixed amount for
            entry tickets, or leave it open for donations.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Restaurants and food stalls.</strong>{" "}
            Place QR codes on tables or takeaway packaging for contactless payment.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Splitting bills.</strong>{" "}
            Generate a QR code pre-filled with your share of a bill amount so friends can pay
            you back precisely.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Fixed Amount vs. Open Amount
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The Amount field is optional. Here is when to use each:
        </p>
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["Open amount (no ₹ set)", "Retail counters, general receiving, donations where payer chooses the sum"],
                ["Fixed amount", "Specific invoices, event tickets, bill splits, fundraiser targets"],
              ].map(([type, use]) => (
                <tr key={type}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{type}</td>
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
            {[
              ["/url-qr-code-generator", "URL QR Code Generator", "link to any website from a printed code"],
              ["/phone-qr-code-generator", "Phone Call QR Code Generator", "open the dialer instantly when scanned"],
              ["/vcard-qr-code-generator", "vCard QR Code Generator", "share your full contact details in one scan"],
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
