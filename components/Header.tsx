"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",                   label: "Generate" },
  { href: "/qr-code-scanner",   label: "Scan QR" },
  { href: "/image-to-text",     label: "Extract Text" },
  { href: "/bulk-qr-generator", label: "Bulk QR" },
];

const logoSvg = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
    <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();

  function makeNavItems(variant: "desktop" | "mobile") {
    const pad = variant === "desktop" ? "8px 16px" : "8px 14px";
    const size = variant === "desktop" ? "15px" : "14px";
    return NAV_LINKS.map(({ href, label }) => {
      const active = href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(href + "/");
      return (
        <NavLinkItem key={href} href={href} label={label} active={active} pad={pad} size={size} />
      );
    });
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4">

        {/* ── Desktop (≥768px): single row — logo left, nav right ── */}
        <div className="hidden items-center justify-between py-3 md:flex">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold tracking-tight"
            style={{ color: "#06b6d4" }}
            aria-label="QR Code Generator – Home"
          >
            {logoSvg}
            <span>QR Maker</span>
          </Link>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">{makeNavItems("desktop")}</ul>
          </nav>
        </div>

        {/* ── Mobile (<768px): two rows — logo top, nav below ── */}
        <div className="md:hidden">
          {/* Row 1: logo */}
          <div className="py-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold tracking-tight"
              style={{ color: "#06b6d4" }}
              aria-label="QR Code Generator – Home"
            >
              {logoSvg}
              <span>QR Maker</span>
            </Link>
          </div>
          {/* Row 2: scrollable nav */}
          <nav
            aria-label="Main navigation"
            style={{
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            } as React.CSSProperties}
          >
            <ul
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                padding: "4px 0 8px",
                minWidth: "max-content",
              }}
            >
              {makeNavItems("mobile")}
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}

function NavLinkItem({
  href,
  label,
  active,
  pad,
  size,
}: {
  href: string;
  label: string;
  active: boolean;
  pad: string;
  size: string;
}) {
  return (
    <li style={{ flexShrink: 0 }}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="nav-link"
        style={{ padding: pad, fontSize: size }}
      >
        {label}
      </Link>
    </li>
  );
}
