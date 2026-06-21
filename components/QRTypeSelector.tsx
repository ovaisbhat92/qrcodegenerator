"use client";

import type { QRType } from "@/types/qr";

interface Props {
  value: QRType;
  onChange: (type: QRType) => void;
}

const TABS: { id: QRType; label: string; icon: string }[] = [
  { id: "url",  label: "Website URL", icon: "🔗" },
  { id: "text", label: "Plain Text",  icon: "📝" },
  { id: "wifi", label: "Wi-Fi",       icon: "📶" },
];

export default function QRTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            value === tab.id
              ? "bg-white text-brand-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
