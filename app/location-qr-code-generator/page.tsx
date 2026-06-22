import type { Metadata } from "next";
import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";

export const metadata: Metadata = {
  title: "Location QR Code Generator — Share Any Address or GPS Coordinates",
  description:
    "Create a location QR code that opens Google Maps or Apple Maps to any address, landmark, or GPS pin. Free, instant, no signup. Download PNG, SVG, or PDF.",
  alternates: {
    canonical: "https://qrcodegenerator.vercel.app/location-qr-code-generator",
  },
  openGraph: {
    title: "Location QR Code Generator — Share Any Address or GPS Coordinates",
    description:
      "Create a location QR code that opens Google Maps or Apple Maps to any address, landmark, or GPS pin. Free, instant, no signup. Download PNG, SVG, or PDF.",
    url: "https://qrcodegenerator.vercel.app/location-qr-code-generator",
    siteName: "QR Code Generator",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://qrcodegenerator.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://qrcodegenerator.vercel.app/qr-code-generator" },
    { "@type": "ListItem", position: 3, name: "Location QR Code Generator", item: "https://qrcodegenerator.vercel.app/location-qr-code-generator" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Will a location QR code open Apple Maps or Google Maps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on which mode you use. A Google Maps share link (maps.app.goo.gl or goo.gl/maps) will open Google Maps on both iOS and Android if the app is installed. GPS coordinates encoded as a geo: URI (latitude/longitude mode) will open Apple Maps on iPhone by default, and Google Maps or the device default on Android. For cross-platform compatibility without depending on a specific app, the coordinates mode is more flexible.",
      },
    },
    {
      "@type": "Question",
      name: "What coordinate format should I use for GPS coordinates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use decimal degrees (DD), which is the standard format for geo: URIs. For example, New York City is 40.7128 (latitude) and -74.0060 (longitude). Negative latitude indicates south of the equator; negative longitude indicates west of the prime meridian. Do not use degrees-minutes-seconds (DMS) format — convert to decimal degrees first if your GPS source gives you that format.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a location QR code for a business address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, and it is one of the most practical uses. Find your business on Google Maps, tap Share, and paste the link into this generator. This is better than encoding just an address string because it opens the exact verified listing rather than asking the maps app to search for the address — eliminating ambiguity when there are multiple businesses with similar names.",
      },
    },
    {
      "@type": "Question",
      name: "Do location QR codes work without an internet connection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The QR code itself can be scanned without internet. However, opening a maps app to display the location does require connectivity — either mobile data or Wi-Fi — since the map tiles and place information are loaded from the server. If you need the code to work in areas with no connectivity, consider also printing the address as readable text next to the QR code as a fallback.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between pasting a Google Maps link and entering coordinates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Google Maps link opens the specific place, business, or route you shared — including its name and any saved reviews or photos. It requires Google Maps to be installed and a working internet connection. GPS coordinates (latitude/longitude) encode a precise geographic point using the geo: URI standard. They open the device's default map app and work for any location, including places without a Google Maps listing such as rural land, trail heads, or construction sites.",
      },
    },
  ],
};

export default function LocationQRCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QRGenerator defaultType="location" />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Location QR Code Generator
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          A location QR code opens a maps app to a specific place the moment it is scanned — no
          typing, no searching, no wrong turns. Whether you are directing event guests to a venue,
          pointing buyers to a property listing, or marking a GPS waypoint for a hiking trail,
          this generator creates the right format for your use case in seconds.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Two Ways to Encode a Location
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          This generator supports two input modes. Choose the one that fits your situation:
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Google Maps link (paste a share URL)
        </h3>
        <p className="mb-3 text-gray-600 dark:text-gray-400">
          Open Google Maps, find your destination, tap the Share button, and copy the link. Paste
          it into the Maps Link field above. The QR code will open that exact place — including its
          verified name, reviews, and Google Maps listing.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use this mode when the location has a verified Google Maps listing (a business, venue,
          or landmark), or when you want to share a specific saved route rather than a simple pin.
          The short link formats (<code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">maps.app.goo.gl</code> or{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">goo.gl/maps</code>) produce sparser QR codes
          and scan more reliably at small print sizes than copying the full address-bar URL.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Latitude / longitude coordinates
        </h3>
        <p className="mb-3 text-gray-600 dark:text-gray-400">
          Enter the decimal-degree coordinates of your location (e.g.,{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">40.7128</code>,{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">-74.0060</code> for
          New York City). The generator encodes a{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">geo:</code> URI —
          the open standard for geographic coordinates in QR codes.
        </p>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use this mode for locations with no street address or Google Maps listing — rural fields,
          trail heads, construction sites, offshore platforms, or any GPS waypoint. It also works
          across all map apps rather than requiring Google Maps specifically. On iPhone,{" "}
          <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">geo:</code> URIs
          open Apple Maps by default; on Android, they open Google Maps or the device default.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How Scanning Apps Handle Location QR Codes
        </h2>
        <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">iPhone native camera (iOS 14+):</strong>{" "}
            Recognises Google Maps URLs and shows an &ldquo;Open in Maps&rdquo; prompt. Recognises{" "}
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">geo:</code> URIs and
            opens Apple Maps with the pin placed at the exact coordinates.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Android camera and Google Lens:</strong>{" "}
            Opens Google Maps directly for both Maps URLs and{" "}
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">geo:</code> URIs.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Third-party QR scanners:</strong>{" "}
            Most popular apps (QR &amp; Barcode Scanner, QRbot, Scanbot) display a &ldquo;View in Maps&rdquo;
            action for both formats. Short redirect links (<code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">goo.gl/maps</code>)
            may not resolve on some apps — use the{" "}
            <code className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">maps.app.goo.gl</code>{" "}
            format when in doubt, or use coordinates instead.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Top Use Cases for Location QR Codes
        </h2>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Events and venues
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Print a location QR code on wedding invitations, conference lanyards, festival wristbands,
          and event signage. Guests scan at home to add directions before they leave, or on arrival
          to navigate to a specific gate, parking area, or stage. For multi-venue events, produce
          a separate code for each location and label them clearly.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Real estate
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Property signs, developer hoardings, and letting agency windows benefit from a location
          QR code that opens the exact site in Maps — especially useful for rural or semi-rural
          listings where the postcode covers a wide area and buyers can spend time searching for the
          entrance. Pair with a{" "}
          <Link
            href="/phone-qr-code-generator"
            className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 dark:text-indigo-400"
          >
            phone call QR code
          </Link>{" "}
          to let interested buyers call the agent with a single additional scan.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Tourism and wayfinding
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Walking tour stops, museum trail markers, national park information boards, and heritage
          site signage all benefit from QR codes that anchor each point of interest to a precise
          map location. Visitors tap for turn-by-turn directions to the next stop without following
          a printed route map or asking staff for directions.
        </p>

        <h3 className="mb-2 mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Delivery and logistics
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Delivery failures often occur when the recipient address is ambiguous — a long driveway,
          a rear entrance, a shared postcode with multiple buildings. A location QR code encoding
          the precise drop-off coordinates eliminates this ambiguity for e-commerce deliveries,
          food delivery, and courier services. Print it on the address label alongside the postal
          address as a navigator-friendly supplement.
        </p>

        <h2 className="mb-3 mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How to Create Your Location QR Code
        </h2>
        <ol className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
          {[
            [
              "Select the Location tab",
              "Pre-selected on this page. Choose Maps Link mode for a Google Maps URL, or Lat / Long mode for GPS coordinates.",
            ],
            [
              "Enter your location",
              "For Maps Link: paste the share URL from Google Maps. For Lat / Long: enter decimal-degree coordinates (e.g., 51.5074, -0.1278 for London).",
            ],
            [
              "Preview in real time",
              "The QR code updates as you type. Scan the live preview on your phone and confirm the correct location opens in your maps app.",
            ],
            [
              "Customise the design",
              "For outdoor signage, a high-contrast Classic preset (black on white) scans most reliably. Choose branded colors for indoor or digital use.",
            ],
            [
              "Test on both iOS and Android",
              "Confirm the correct app opens on each platform before going to print — especially important for coordinates mode.",
            ],
            [
              "Download",
              "PNG for digital use, SVG for scalable print artwork, or PDF for a ready-to-print A4 sheet.",
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
          Tips for Reliable Location QR Codes
        </h2>
        <ul className="mb-8 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Use the Share button, not the address bar.
            </strong>{" "}
            Copying the URL directly from the Google Maps address bar produces a long, sessionspecific
            URL that creates a denser QR code and may expire. Always use the canonical share link
            from the Share button.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              For outdoor and rural use, prefer coordinates.
            </strong>{" "}
            GPS coordinates work without requiring Google Maps to be installed and are more
            universally supported by navigation apps including Waze, HERE, and OsmAnd.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Print at a minimum of 3 × 3 cm.
            </strong>{" "}
            Location QR codes, especially those using full Maps URLs, can be moderately dense. A
            larger print size and good lighting ensure reliable scanning.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">
              Add a &ldquo;Scan for directions&rdquo; caption.
            </strong>{" "}
            Users unfamiliar with location QR codes benefit from a brief label beneath the code
            explaining what will happen when they scan it.
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
              ["/text-qr-code-generator", "Text QR Code Generator", "display a message or note directly on screen"],
              ["/phone-qr-code-generator", "Phone Call QR Code Generator", "open the dialer instantly when scanned"],
              ["/vcard-qr-code-generator", "vCard QR Code Generator", "share full contact details in one scan"],
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
