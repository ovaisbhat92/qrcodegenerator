"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",                   label: "Generate" },
  { href: "/qr-code-scanner",   label: "Scan QR" },
  { href: "/image-to-text",     label: "Extract Text" },
  { href: "/bulk-qr-generator", label: "Bulk QR" },
];

export default function Header() {
  const pathname = usePathname();

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
        {/* Single row: logo + nav (nav scrolls horizontally on mobile) */}
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-bold tracking-tight"
            style={{ color: "#06b6d4" }}
            aria-label="QR Code Generator – Home"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
              <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
              <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none" />
            </svg>
            <span className="hidden sm:inline">QR Maker</span>
          </Link>

          {/* Horizontally scrollable nav — hides scrollbar visually */}
          <nav
            aria-label="Main navigation"
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <ul className="flex min-w-max items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm"
                      style={
                        active
                          ? { color: "#06b6d4", background: "rgba(6,182,212,0.1)" }
                          : { color: "var(--text-secondary)" }
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
