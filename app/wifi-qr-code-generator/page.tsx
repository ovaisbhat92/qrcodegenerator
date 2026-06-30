import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator — Share Your WiFi Instantly",
  description:
    "Generate a WiFi QR code to let guests connect instantly without typing a password. Supports WPA/WPA2, WEP, and open networks. Free, browser-only, no signup required.",
  alternates: {
    canonical: "https://www.freeqrcodemaker.in/wifi-qr-code-generator",
  },
  openGraph: {
    title: "Free WiFi QR Code Generator — Share Your WiFi Instantly",
    description:
      "Generate a WiFi QR code to let guests connect instantly without typing a password. Supports WPA/WPA2, WEP, and open networks. Free, browser-only, no signup required.",
    url: "https://www.freeqrcodemaker.in/wifi-qr-code-generator",
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
    { "@type": "ListItem", position: 3, name: "WiFi QR Code Generator", item: "https://www.freeqrcodemaker.in/wifi-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is my WiFi password stored anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your WiFi password is only encoded into the QR image that is generated locally in your browser. It is never sent to our servers or any third party. The QR image lives only on your device until you choose to print or share it.",
      },
    },
    {
      "@type": "Question",
      name: "Which devices can scan WiFi QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Android 10 and later can connect directly using the native camera app. iOS 11 and later supports WiFi QR codes through the built-in camera. Most modern smartphones — including Samsung, Google Pixel, OnePlus, and iPhone — support this feature natively without any additional app.",
      },
    },
    {
      "@type": "Question",
      name: "Does this work for hidden networks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Toggle the 'Hidden network' option in the form before generating the QR code. The resulting QR encodes H:true in the WiFi payload, which tells the scanning device to connect to a network that is not broadcasting its SSID.",
      },
    },
    {
      "@type": "Question",
      name: "What encryption type should I choose?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose WPA / WPA2 for virtually all modern routers — it is the current security standard. Select WEP only if you have an older router that does not support WPA (WEP is considered insecure and should be replaced if possible). Choose 'None' for fully open public networks that have no password.",
      },
    },
    {
      "@type": "Question",
      name: "Can guests connect without seeing my password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. That is the primary use case for a WiFi QR code. Print it on a card or frame it in a visible spot. Guests scan it and connect automatically — they never see or handle the actual password. You can regenerate a new QR code any time you change the WiFi password.",
      },
    },
  ],
};

export default function WifiQRPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <QRGenerator defaultType="wifi" />

        <article className="mx-auto max-w-3xl px-4 pb-16">
          <h1 className="mb-4 text-3xl font-bold">Free WiFi QR Code Generator</h1>

          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            A WiFi QR code lets anyone connect to your wireless network by simply pointing their phone
            camera at a printed code — no typing, no spelling mistakes, no sharing passwords verbally.
            The device reads the network name, encryption type, and password directly from the QR, then
            connects automatically. It is the fastest and most private way to share WiFi access.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Where WiFi QR Codes Are Used</h2>
          <ul className="mb-4 list-disc space-y-2 pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong>Homes</strong> — frame a printed WiFi QR code near the router or in the guest
              bedroom so visitors can connect without asking. Replace the printout whenever you change
              the password.
            </li>
            <li>
              <strong>Cafes and restaurants</strong> — display the QR on table cards or the menu
              board. Customers connect in seconds, freeing staff from answering the same WiFi question
              dozens of times a day.
            </li>
            <li>
              <strong>Hotels and serviced apartments</strong> — include a WiFi QR code on the
              welcome card or in the room compendium. Guests appreciate not having to type a long
              hotel-style password on a phone keyboard.
            </li>
            <li>
              <strong>Offices and co-working spaces</strong> — put the guest WiFi QR at reception or
              in meeting rooms so clients and contractors connect instantly without bothering the IT
              team.
            </li>
            <li>
              <strong>Events and conferences</strong> — print the WiFi QR code on the event badge,
              lanyard, or signage so attendees stay connected throughout the day without hunting for
              a handout.
            </li>
          </ul>

          <h2 className="mb-3 mt-8 text-xl font-semibold">How a WiFi QR Code Works</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The WiFi QR format is a plain-text string that encodes the network name (SSID), encryption
            type, and password in a standardised structure:{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>
              WIFI:T:WPA;S:NetworkName;P:password;;
            </code>
            . When a phone camera reads this string, the operating system recognises the{" "}
            <code style={{ background: "var(--bg-input)", borderRadius: "4px", padding: "1px 5px", fontSize: "0.85em" }}>WIFI:</code>
            {" "}prefix and prompts the user to join the network with a single tap. The format is an open
            standard supported natively on Android 10+, iOS 11+, and most modern camera apps.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Security Considerations</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            A WiFi QR code encodes your password in a form that can be read by anyone who scans the
            image. Treat the printed QR code with the same care as the password itself — do not post
            it publicly on social media or in unsecured digital spaces. For a guest network that is
            isolated from your main devices (most modern routers support this), the risk is
            significantly lower since guests can only reach the internet, not your local devices.
          </p>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            The QR code generator on this page runs entirely in your browser. Your password is
            encoded into the image locally and is never transmitted anywhere. You can verify this by
            using the browser&apos;s developer tools to check network requests — none are made during
            QR generation.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">WPA vs WEP vs Open Networks</h2>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>WPA / WPA2</strong> is the current standard for home and business WiFi security.
            Almost every router sold since 2004 supports it. Choose this option for virtually all
            modern networks. WPA3 — the successor — also uses the same QR encoding.
          </p>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>WEP</strong> (Wired Equivalent Privacy) is an older, now-insecure encryption
            standard. If your router only supports WEP, you should consider replacing it. Select WEP
            in this generator only if your specific router requires it.
          </p>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            <strong>Open networks</strong> have no password and no encryption. Appropriate for free
            public WiFi where security is managed at the router level (e.g. captive portal, firewall).
            Select &quot;None&quot; in the encryption dropdown for these networks.
          </p>

          <h2 className="mb-3 mt-8 text-xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <summary className="cursor-pointer font-semibold">{faq.name}</summary>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <p className="mb-3 text-sm font-semibold">Related QR code generators</p>
            <nav className="flex flex-wrap gap-3 text-sm" aria-label="Related tools">
              <Link href="/url-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>URL QR Code Generator</Link>
              <Link href="/vcard-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>vCard QR Code Generator</Link>
              <Link href="/whatsapp-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>WhatsApp QR Code Generator</Link>
              <Link href="/email-qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>Email QR Code Generator</Link>
              <Link href="/qr-code-generator" className="hover:underline" style={{ color: "#06b6d4" }}>QR Code Generator</Link>
            </nav>
          </div>
        </article>
      </main>
    </>
  );
}
