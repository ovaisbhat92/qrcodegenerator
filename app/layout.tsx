import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://qrcodegenerator.space"),
  title: "QR Code Generator — Free, Custom, Instant",
  description:
    "Generate custom QR codes for website URLs, plain text, phone numbers, contacts, and locations. Supports gradients, dot styles, corner styles, and logo embedding. Runs entirely in your browser.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#0a1628",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Footer />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
