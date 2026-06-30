"use client";

import type { QRType } from "@/types/qr";

interface Props {
  value: QRType;
  onChange: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; icon: React.ReactNode }[] = [
  { id: "phone",    label: "Phone",       icon: <PhoneIcon /> },
  { id: "sms",      label: "SMS",         icon: <SmsIcon /> },
  { id: "vcard",    label: "vCard",       icon: <VCardIcon /> },
  { id: "whatsapp", label: "WhatsApp",    icon: <WhatsAppIcon /> },
  { id: "email",    label: "Email",       icon: <EmailIcon /> },
  { id: "url",      label: "Website URL", icon: <LinkIcon /> },
  { id: "upi",      label: "UPI",         icon: <UpiIcon /> },
  { id: "wifi",     label: "WiFi",        icon: <WifiIcon /> },
  { id: "text",     label: "Plain Text",  icon: <TextIcon /> },
];

export default function QRTypeSelector({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="QR code type"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
      }}
    >
      {TYPES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.id)}
            className="qr-type-btn"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 8px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              gap: "4px",
              minHeight: "64px",
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhoneIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SmsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function VCardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function WhatsAppIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
}

function EmailIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function LinkIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function UpiIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function WifiIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 12.55a11 11 0 0114.08 0" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.42 9a16 16 0 0121.16 0" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.53 16.11a6 6 0 016.95 0" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="20" x2="12.01" y2="20" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TextIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" /><polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
