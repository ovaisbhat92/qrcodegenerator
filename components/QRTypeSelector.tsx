"use client";

import type { QRType } from "@/types/qr";

interface Props {
  value: QRType;
  onChange: (type: QRType) => void;
}

const TABS: { id: QRType; label: string; icon: string }[] = [
  { id: "url",      label: "Website URL", icon: "🔗" },
  { id: "text",     label: "Plain Text",  icon: "📝" },
  { id: "phone",    label: "Phone",       icon: "📞" },
  { id: "vcard",    label: "vCard",       icon: "👤" },
  { id: "location", label: "Location",    icon: "📍" },
  { id: "upi",      label: "UPI Pay",     icon: "💸" },
];

export default function QRTypeSelector({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="QR code type"
      className="flex flex-wrap gap-1 rounded-xl p-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            "flex flex-1 basis-[30%] items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            value === tab.id ? "btn-cyan" : "",
          ].join(" ")}
          style={value === tab.id ? {} : { color: "var(--text-secondary)" }}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
