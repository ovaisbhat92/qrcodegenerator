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
];

export default function QRTypeSelector({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="QR code type"
      className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            "flex flex-1 basis-[30%] items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            value === tab.id
              ? "bg-white text-brand-600 shadow-sm dark:bg-gray-600 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200",
          ].join(" ")}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
