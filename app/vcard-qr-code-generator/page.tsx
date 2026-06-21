import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "vCard QR Code Generator — Share Contact Details Instantly",
  description:
    "Create a vCard QR code with your name, phone, email, company, job title, website, and address. Scan to save contact on any iPhone or Android. Free download — PNG, SVG, PDF.",
  alternates: {
    canonical: "https://qrcodegenerator.vercel.app/vcard-qr-code-generator",
  },
  openGraph: {
    title: "vCard QR Code Generator — Share Contact Details Instantly",
    description:
      "Create a vCard QR code with your name, phone, email, company, job title, website, and address. Scan to save contact on any iPhone or Android. Free download — PNG, SVG, PDF.",
    url: "https://qrcodegenerator.vercel.app/vcard-qr-code-generator",
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
      name: "Which fields are required to generate a vCard QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only the Full Name field is required. All other fields — phone, email, company, job title, website, and address — are optional. You can create a minimal QR code with just a name, or a comprehensive one with all seven fields. The QR code size increases slightly as you add more information.",
      },
    },
    {
      "@type": "Question",
      name: "Will the contact save automatically when someone scans my vCard QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Almost. On iPhone, the native Camera app recognises the vCard data and shows an 'Add to Contacts' banner at the top of the screen — tapping it opens the new contact form pre-filled with your details. On Android, the Camera app or Google Lens similarly prompts 'Save contact.' The user still taps to confirm; the contact is never saved without their action, which is a deliberate privacy safeguard.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support social media links or WhatsApp numbers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The vCard 3.0 standard used by this generator supports name, phone, email, organisation, job title, website URL, and physical address. It does not have dedicated fields for social media profiles. You can put a social media profile URL in the Website field, and it will be saved to the contact. WhatsApp uses its own QR format (wa.me links), which is separate from vCard.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I update my information — do I need to reprint the QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A vCard QR code encodes your details statically inside the image. If your phone number, email, or job title changes, you will need to generate a new QR code and reprint any materials that use it. To avoid this, consider encoding a URL QR code that links to an online business card page (e.g., on LinkedIn or a personal site), where you can update details without reprinting.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use special characters like accented letters or non-Latin scripts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. vCard 3.0 supports UTF-8 encoding, and this generator encodes data accordingly. Names and addresses with accented characters (é, ü, ñ), Chinese, Arabic, or other Unicode text are supported. However, QR codes with non-Latin characters may produce slightly denser patterns, so use error correction level M or H and test on multiple devices.",
      },
    },
    {
      "@type": "Question",
      name: "Is the vCard format compatible with Outlook, Gmail, and Apple Contacts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. vCard 3.0 is a universally supported standard. Apple Contacts, Google Contacts (and therefore Gmail), Microsoft Outlook, and virtually every other contacts application on desktop or mobile can import vCard files. The data saved from scanning your QR code on a phone can also be exported as a .vcf file and imported directly into any of these desktop apps.",
      },
    },
  ],
};

export default function VCardQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Generator embedded at the top, pre-set to vcard type */}
      <QRGenerator defaultType="vcard" />

      {/* SEO content section */}
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          vCard QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          A vCard QR code encodes your complete contact information — name, phone, email,
          company, job title, website, and address — in the open vCard 3.0 standard. When
          someone scans it, their phone instantly offers to save you as a new contact. No app
          required, no typing, no business card that gets lost.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          What Is a vCard QR Code?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          vCard (Virtual Business Card) is an open file format for storing and sharing contact
          information. Version 3.0 — used by this generator — is the most widely supported
          variant across all major platforms: iPhone Contacts, Android, Google Contacts, Microsoft
          Outlook, Apple Mail, and dedicated QR scanner apps.
        </p>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The vCard data is encoded directly inside the QR image. When the scanner reads it, the
          device parses the structured text and presents a &ldquo;Save contact&rdquo; prompt pre-filled with
          all your details. The contact is stored in the native contacts app alongside contacts
          from any other source — email, messages, or manual entry.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          What Information Can You Include?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Fill in as many or as few fields as you need. Only your full name is required to generate
          a valid vCard QR code. The supported fields are:
        </p>
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Field
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Required
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
              {[
                ["Full name", "Yes", "First and last name saved separately in contacts"],
                ["Phone number", "No", "Saved as mobile number; include country code"],
                ["Email", "No", "Saved as the primary email address"],
                ["Company", "No", "Organisation field in contacts"],
                ["Job title", "No", "Saved alongside organisation"],
                ["Website", "No", "Saved as the contact's URL / homepage"],
                ["Address", "No", "Physical address — street, city, postcode"],
              ].map(([field, req, note]) => (
                <tr key={field}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {field}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{req}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Create Your vCard QR Code
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              1
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                The vCard tab is pre-selected
              </strong>{" "}
              on this page. Fill in your Full Name — the minimum required — then add as many
              additional fields as you want.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              2
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Watch the live preview
              </strong>{" "}
              on the right update as you type. The QR code regenerates with each change.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              3
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Customise the design
              </strong>{" "}
              to match your brand colors. For business cards, the Classic or Blue Business
              presets are popular choices. If you add a company logo, set error correction to H.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              4
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">
                Test before printing.
              </strong>{" "}
              Scan the preview with both an iPhone and an Android device. Confirm all fields save
              correctly and the name appears as expected in the contacts app.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              5
            </span>
            <span>
              <strong className="text-gray-800 dark:text-gray-200">Download</strong> — PNG for
              digital sharing, SVG or PDF for print-ready artwork.
            </span>
          </li>
        </ol>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Compatibility — Apps and Platforms
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          vCard 3.0 is one of the most universally supported standards in personal computing. Here
          is how the major platforms handle it:
        </p>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">iPhone (iOS 11+):</strong> The
            native Camera app recognises vCard QR codes and shows an &ldquo;Add to Contacts&rdquo; banner
            without needing any third-party app.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Android (6.0+):</strong> Google
            Lens, the native Camera app on most devices, and all major QR scanner apps detect
            vCard data and prompt to save the contact.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Microsoft Outlook:</strong>{" "}
            Contacts saved from a vCard QR on a phone can be exported as a .vcf file and imported
            directly into Outlook on Windows or Mac.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Google Contacts / Gmail:</strong>{" "}
            Contacts scanned on Android sync automatically to Google Contacts, making them
            available across all Google services.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Apple Contacts / iCloud:</strong>{" "}
            Contacts scanned on iPhone sync to iCloud and appear on iPad, Mac, and any other
            Apple device signed in to the same account.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Professional Use Cases
        </h2>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Business cards
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The most common use case. Print a vCard QR code on the back of your business card.
          Anyone you hand a card to can scan it and have your details saved instantly, rather than
          manually typing from the front of the card. This is particularly useful at conferences,
          trade shows, or client meetings where people collect many cards and often lose them.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Conference name badges
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Organisers can print individual vCard QR codes on lanyards or name badges so attendees
          can scan each other effortlessly. This replaces the need for business card exchanges and
          makes post-event follow-up simpler when all contacts are already in the phone.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Email signatures and LinkedIn
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Embedding a vCard QR code in your email signature (as a small image) or on your LinkedIn
          profile &ldquo;Featured&rdquo; section gives people scanning your digital footprint an easy way to
          save your contact details. It works especially well in PDF proposals and presentations.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Office doors and desk placards
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          A placard outside your office or on your desk with a vCard QR code lets visitors save
          your contact without asking for a card. Useful in open-plan offices or co-working spaces
          where business card exchanges are less common.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Tips for Networking Events
        </h2>
        <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Keep it focused.</strong> For
            quick networking exchanges, name, phone, and email is usually enough. Adding all seven
            fields makes the QR code denser and slightly harder to scan.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Use error correction H if adding a logo.
            </strong>{" "}
            A company logo over the QR centre requires 30% error correction to remain scannable.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Test before printing hundreds of cards.
            </strong>{" "}
            Scan the code on both iOS and Android. Check that the name splits correctly into first
            and last name in the contacts app.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Add a &ldquo;Scan to save contact&rdquo; label.
            </strong>{" "}
            Not everyone is familiar with vCard QR codes. A small caption below the code sets
            expectations and increases scan rates.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Consider a{" "}
              <Link
                href="/url-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                URL QR code
              </Link>{" "}
              linking to an online card.
            </strong>{" "}
            If your details change frequently, a URL QR code pointing to your LinkedIn or a
            personal landing page lets you update information without reprinting.
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
                href="/phone-qr-code-generator"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                Phone Call QR Code Generator
              </Link>{" "}
              — encode a phone number so scanners open the dialer instantly
            </li>
            <li>
              <Link
                href="/"
                className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
              >
                Full QR Code Generator
              </Link>{" "}
              — all types including text and location QR codes
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
