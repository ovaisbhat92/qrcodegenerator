"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { trackBulkQRGenerated } from "@/lib/analytics";
import {
  generateUrlPayload,
  generateTextPayload,
  generatePhonePayload,
  generateVCardPayload,
  generateLocationPayload,
  generateUpiPayload,
  generateWhatsAppPayload,
  generateEmailPayload,
  generateSmsPayload,
} from "@/lib/qrPayloads";

// ── Constants ─────────────────────────────────────────────────────────────────

const BULK_TYPES = [
  { id: "url",      label: "Website URL" },
  { id: "text",     label: "Plain Text" },
  { id: "phone",    label: "Phone Number" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email",    label: "Email" },
  { id: "sms",      label: "SMS" },
  { id: "upi",      label: "UPI Pay" },
  { id: "vcard",    label: "vCard Contact" },
  { id: "location", label: "Location" },
] as const;

type BulkQRType = (typeof BULK_TYPES)[number]["id"];

const TYPE_COLUMNS: Record<BulkQRType, string[]> = {
  url:      ["url"],
  text:     ["text"],
  phone:    ["phone"],
  whatsapp: ["country_code", "phone", "message"],
  email:    ["email", "subject", "body"],
  sms:      ["phone", "message"],
  upi:      ["upi_id", "payee_name", "amount", "note"],
  vcard:    ["full_name", "phone", "email", "company", "job_title", "website", "address"],
  location: ["lat", "lng", "maps_link"],
};

const SAMPLE_ROWS: Record<BulkQRType, string[][]> = {
  url:      [["https://www.example.com"], ["https://www.yourwebsite.com"]],
  text:     [["Hello from QR code!"], ["Visit our store for offers"]],
  phone:    [["+91 9876543210"], ["+1 555-123-4567"]],
  whatsapp: [["91", "9876543210", "Hi! I found you via QR code"], ["1", "5551234567", "Hello!"]],
  email:    [["contact@example.com", "Hello from QR code", "I scanned your code and wanted to reach out."], ["info@company.com", "", ""]],
  sms:      [["+91 9876543210", "Hi! I scanned your QR code."], ["+1 5551234567", ""]],
  upi:      [["mybiz@okaxis", "My Business", "100", "Payment for services"], ["john@upi", "John Doe", "", ""]],
  vcard:    [["Jane Smith", "+91 9876543210", "jane@example.com", "Acme Corp", "Manager", "https://jane.com", "Mumbai, India"], ["John Doe", "", "", "", "", "", ""]],
  location: [["28.6139", "77.2090", ""], ["", "", "https://maps.app.goo.gl/abc123"]],
};

interface QRInstance {
  getRawData(ext: string): Promise<Blob>;
}

let qrModulePromise: Promise<{ default: unknown }> | null = null;
function getQRModule(): Promise<{ default: unknown }> {
  if (!qrModulePromise) {
    qrModulePromise = import("qr-code-styling") as Promise<{ default: unknown }>;
  }
  return qrModulePromise;
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inQ) { inQ = true; }
    else if (ch === '"' && inQ && line[i + 1] === '"') { cur += '"'; i++; }
    else if (ch === '"' && inQ) { inQ = false; }
    else if (ch === "," && !inQ) { values.push(cur); cur = ""; }
    else { cur += ch; }
  }
  values.push(cur);
  return values;
}

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows = lines.slice(1).map((line) => {
    const vals = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? "").trim(); });
    return row;
  });
  return { headers, rows };
}

function generateSampleCsv(type: BulkQRType): string {
  const cols = TYPE_COLUMNS[type];
  const samples = SAMPLE_ROWS[type];
  const quoteIfNeeded = (v: string) => (v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v);
  return [cols.join(","), ...samples.map((r) => r.map(quoteIfNeeded).join(","))].join("\n");
}

// ── Payload from row ──────────────────────────────────────────────────────────

function rowToPayload(type: BulkQRType, row: Record<string, string>): string {
  switch (type) {
    case "url":      return generateUrlPayload(row.url ?? "");
    case "text":     return generateTextPayload(row.text ?? "");
    case "phone":    return generatePhonePayload(row.phone ?? "");
    case "whatsapp": return generateWhatsAppPayload({ countryCode: row.country_code ?? "91", phone: row.phone ?? "", message: row.message ?? "" });
    case "email":    return generateEmailPayload({ email: row.email ?? "", subject: row.subject ?? "", body: row.body ?? "" });
    case "sms":      return generateSmsPayload({ phone: row.phone ?? "", message: row.message ?? "" });
    case "upi":      return generateUpiPayload({ upiId: row.upi_id ?? "", payeeName: row.payee_name ?? "", amount: row.amount ?? "", note: row.note ?? "" });
    case "vcard":    return generateVCardPayload({ fullName: row.full_name ?? "", phone: row.phone ?? "", email: row.email ?? "", company: row.company ?? "", jobTitle: row.job_title ?? "", website: row.website ?? "", address: row.address ?? "" });
    case "location":
      if (row.maps_link?.trim()) return generateLocationPayload({ mode: "mapslink", mapsLink: row.maps_link, lat: "", lng: "" });
      return generateLocationPayload({ mode: "coordinates", lat: row.lat ?? "", lng: row.lng ?? "", mapsLink: "" });
  }
}

function rowFilename(type: BulkQRType, n: number, row: Record<string, string>): string {
  if (type === "url" && row.url) {
    try {
      const u = row.url.startsWith("http") ? row.url : `https://${row.url}`;
      const domain = new URL(u).hostname.replace(/^www\./, "").replace(/[^a-zA-Z0-9.-]/g, "");
      return `qr-${n}-${domain}.png`;
    } catch { /* fall through */ }
  }
  return `qr-${n}.png`;
}

// ── ZIP builder ───────────────────────────────────────────────────────────────

interface BulkOpts {
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrection: "L" | "M" | "Q" | "H";
}

async function buildZip(
  type: BulkQRType,
  rows: Record<string, string>[],
  opts: BulkOpts,
  onProgress: (p: number) => void
): Promise<Blob> {
  const [jszipMod, qrMod] = await Promise.all([import("jszip"), getQRModule()]);
  const JSZip = jszipMod.default as new () => {
    file(name: string, data: Blob | string): void;
    generateAsync(o: { type: "blob" }): Promise<Blob>;
  };
  const QRCodeStyling = qrMod.default as new (o: Record<string, unknown>) => QRInstance;

  const zip = new JSZip();
  const summary: string[] = ["row_number,input_data,filename,status"];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const n = i + 1;
    const filename = rowFilename(type, n, row);
    let payload: string;
    try {
      payload = rowToPayload(type, row);
    } catch {
      summary.push(`${n},"",${filename},error: payload failed`);
      onProgress(Math.round((n / rows.length) * 100));
      continue;
    }

    if (!payload) {
      summary.push(`${n},"",${filename},error: empty payload`);
      onProgress(Math.round((n / rows.length) * 100));
      continue;
    }

    try {
      const qr = new QRCodeStyling({
        width: opts.size,
        height: opts.size,
        data: payload,
        margin: Math.round(opts.size * 0.05),
        qrOptions: { errorCorrectionLevel: opts.errorCorrection },
        dotsOptions: { type: "square", color: opts.fgColor },
        backgroundOptions: { color: opts.bgColor },
        cornersSquareOptions: { type: "square", color: opts.fgColor },
        cornersDotOptions: { type: "square", color: opts.fgColor },
      });
      const blob = await qr.getRawData("png");
      const inputPreview = Object.values(row).filter(Boolean).join("|").replace(/"/g, '""');
      zip.file(filename, blob);
      summary.push(`${n},"${inputPreview}",${filename},success`);
    } catch (err) {
      summary.push(`${n},"",${filename},error: ${err instanceof Error ? err.message : "generation failed"}`);
    }

    onProgress(Math.round((n / rows.length) * 100));
  }

  zip.file("summary.csv", summary.join("\n"));
  return zip.generateAsync({ type: "blob" });
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BulkQRGenerator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bulkType, setBulkType] = useState<BulkQRType>("url");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [inputMode, setInputMode] = useState<"csv" | "manual">("csv");
  const [csvError, setCsvError] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState<128 | 256 | 512>(256);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = TYPE_COLUMNS[bulkType];

  // CSV upload
  const handleCsvUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const { headers, rows: parsed } = parseCsv(text);
        const cols = TYPE_COLUMNS[bulkType];
        const missing = cols.filter((c) => !headers.includes(c));
        if (missing.length) {
          setCsvError(`Missing required columns: ${missing.join(", ")}`);
          setRows([]);
          return;
        }
        if (!parsed.length) {
          setCsvError("CSV has no data rows.");
          setRows([]);
          return;
        }
        const capped = parsed.slice(0, 100);
        setCsvError(parsed.length > 100 ? `Found ${parsed.length} rows — only the first 100 will be used.` : "");
        setRows(capped);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [bulkType]
  );

  const downloadSample = useCallback(() => {
    const csv = generateSampleCsv(bulkType);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sample-${bulkType}-bulk.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  }, [bulkType]);

  const addRow = useCallback(() => {
    if (rows.length >= 100) return;
    const empty: Record<string, string> = {};
    TYPE_COLUMNS[bulkType].forEach((c) => { empty[c] = ""; });
    setRows((prev) => [...prev, empty]);
  }, [rows.length, bulkType]);

  const removeRow = useCallback((i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const updateCell = useCallback((rowIdx: number, col: string, val: string) => {
    setRows((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, [col]: val } : r)));
  }, []);

  const handleTypeChange = useCallback((type: BulkQRType) => {
    setBulkType(type);
    setRows([]);
    setCsvError("");
    setInputMode("csv");
  }, []);

  // Preview in step 3
  useEffect(() => {
    if (step !== 3 || !rows.length) { setPreviewDataUrl(null); return; }
    let cancelled = false;
    const payload = rowToPayload(bulkType, rows[0]);
    if (!payload) { setPreviewDataUrl(null); return; }

    getQRModule().then(({ default: QRCodeStyling }) => {
      if (cancelled) return;
      const Ctor = QRCodeStyling as new (o: Record<string, unknown>) => QRInstance;
      const qr = new Ctor({
        width: 200, height: 200, data: payload, margin: 10,
        qrOptions: { errorCorrectionLevel: errorCorrection },
        dotsOptions: { type: "square", color: fgColor },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { type: "square", color: fgColor },
        cornersDotOptions: { type: "square", color: fgColor },
      });
      qr.getRawData("png").then((blob) => {
        if (cancelled) return;
        const reader = new FileReader();
        reader.onload = (ev) => { if (!cancelled) setPreviewDataUrl(ev.target?.result as string); };
        reader.readAsDataURL(blob);
      }).catch(() => {});
    });

    return () => { cancelled = true; };
  }, [step, rows, bulkType, fgColor, bgColor, errorCorrection]);

  // Generate ZIP
  const handleGenerate = useCallback(async () => {
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    setZipUrl(null);
    setProgress(0);
    setGenerating(true);
    setStep(4);
    try {
      const blob = await buildZip(bulkType, rows, { fgColor, bgColor, size, errorCorrection }, setProgress);
      const url = URL.createObjectURL(blob);
      setZipUrl(url);
      trackBulkQRGenerated({ qr_type: bulkType, count: rows.length });
    } catch (err) {
      console.error("Bulk generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }, [bulkType, rows, fgColor, bgColor, size, errorCorrection, zipUrl]);

  const reset = useCallback(() => {
    if (zipUrl) URL.revokeObjectURL(zipUrl);
    setZipUrl(null);
    setStep(1);
    setBulkType("url");
    setRows([]);
    setCsvError("");
    setProgress(0);
    setFgColor("#000000");
    setBgColor("#ffffff");
    setSize(256);
    setErrorCorrection("M");
    setInputMode("csv");
  }, [zipUrl]);

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <StepIndicator step={step} />

      {/* ── Step 1: Choose type ── */}
      {step === 1 && (
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <h2 className="mb-1 text-lg font-semibold">Choose QR type</h2>
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              Select the type of QR code you want to generate in bulk (up to 100 at once).
            </p>
            <select
              value={bulkType}
              onChange={(e) => handleTypeChange(e.target.value as BulkQRType)}
              className="themed-input w-full"
            >
              {BULK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-hint)" }}
          >
            <strong className="font-semibold" style={{ color: "var(--text-secondary)" }}>Required columns: </strong>
            {TYPE_COLUMNS[bulkType].join(", ")}
          </div>
          <button
            type="button"
            className="w-full rounded-xl px-6 py-3 text-sm font-semibold btn-cyan"
            onClick={() => setStep(2)}
          >
            Next: Add Data →
          </button>
        </div>
      )}

      {/* ── Step 2: Add data ── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 text-lg font-semibold">Add data for {BULK_TYPES.find((t) => t.id === bulkType)?.label} QR codes</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Upload a CSV or enter data manually. Max 100 rows.
            </p>
          </div>

          {/* Tab selector */}
          <div
            role="group"
            aria-label="Input mode"
            className="flex gap-1 rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
          >
            {(["csv", "manual"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setInputMode(mode); if (mode === "manual" && rows.length === 0) addRow(); }}
                aria-pressed={inputMode === mode}
                className={["flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  inputMode === mode ? "btn-cyan" : ""].join(" ")}
                style={inputMode === mode ? {} : { color: "var(--text-secondary)" }}
              >
                {mode === "csv" ? "Upload CSV" : "Enter Manually"}
              </button>
            ))}
          </div>

          {/* CSV tab */}
          {inputMode === "csv" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={downloadSample}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Download sample CSV
                </button>
                <span className="text-xs" style={{ color: "var(--text-hint)" }}>
                  Columns: {columns.join(", ")}
                </span>
              </div>

              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-center transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    if (fileInputRef.current) {
                      Object.defineProperty(fileInputRef.current, "files", { value: dt.files, writable: true });
                      handleCsvUpload({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }
                }}
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-medium">Click to upload CSV or drag &amp; drop</span>
                <span className="text-xs" style={{ color: "var(--text-hint)" }}>Max 100 rows</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="sr-only"
                  onChange={handleCsvUpload}
                />
              </label>

              {csvError && (
                <p className="rounded-lg px-3 py-2 text-sm text-amber-600 dark:text-amber-400" style={{ background: "rgba(251,191,36,0.1)" }}>
                  ⚠️ {csvError}
                </p>
              )}

              {rows.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    {rows.length} row{rows.length !== 1 ? "s" : ""} loaded — preview (first 5):
                  </p>
                  <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
                    <table className="w-full text-xs">
                      <thead style={{ background: "var(--bg-input)" }}>
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--text-hint)" }}>#</th>
                          {columns.map((c) => (
                            <th key={c} className="px-3 py-2 text-left font-semibold" style={{ color: "var(--text-hint)" }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 5).map((row, i) => (
                          <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                            <td className="px-3 py-2" style={{ color: "var(--text-hint)" }}>{i + 1}</td>
                            {columns.map((c) => (
                              <td key={c} className="max-w-[160px] truncate px-3 py-2" style={{ color: "var(--text-secondary)" }}>
                                {row[c] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual tab */}
          {inputMode === "manual" && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--bg-input)" }}>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: "var(--text-hint)" }}>#</th>
                      {columns.map((c) => (
                        <th key={c} className="px-3 py-2 text-left text-xs font-semibold" style={{ color: "var(--text-hint)" }}>{c}</th>
                      ))}
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="px-3 py-2 text-xs" style={{ color: "var(--text-hint)" }}>{i + 1}</td>
                        {columns.map((c) => (
                          <td key={c} className="px-2 py-1.5">
                            <input
                              type="text"
                              value={row[c] ?? ""}
                              onChange={(e) => updateCell(i, c, e.target.value)}
                              className="themed-input text-sm"
                              style={{ minWidth: "100px" }}
                              placeholder={c}
                            />
                          </td>
                        ))}
                        <td className="px-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            className="rounded px-2 py-1 text-xs transition-colors"
                            style={{ color: "var(--text-hint)" }}
                            aria-label={`Remove row ${i + 1}`}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                disabled={rows.length >= 100}
                onClick={addRow}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                + Add row {rows.length >= 100 ? "(max reached)" : `(${rows.length}/100)`}
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl px-5 py-2.5 text-sm font-medium"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={rows.length === 0}
              onClick={() => setStep(3)}
              className="flex-1 rounded-xl px-6 py-2.5 text-sm font-semibold btn-cyan disabled:opacity-50"
            >
              Next: Customize →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Customize ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 text-lg font-semibold">Customize QR style</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              These settings apply to all {rows.length} QR code{rows.length !== 1 ? "s" : ""}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  QR color (foreground)
                </label>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-16 cursor-pointer rounded-lg border-0 bg-transparent" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Background color
                </label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-16 cursor-pointer rounded-lg border-0 bg-transparent" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Size (px)
                </label>
                <div className="flex gap-2">
                  {([128, 256, 512] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={["flex-1 rounded-lg py-1.5 text-sm font-medium transition-all",
                        size === s ? "btn-cyan" : ""].join(" ")}
                      style={size === s ? {} : { background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Error correction
                </label>
                <div className="flex gap-2">
                  {(["L", "M", "Q", "H"] as const).map((ec) => (
                    <button
                      key={ec}
                      type="button"
                      onClick={() => setErrorCorrection(ec)}
                      className={["flex-1 rounded-lg py-1.5 text-sm font-medium transition-all",
                        errorCorrection === ec ? "btn-cyan" : ""].join(" ")}
                      style={errorCorrection === ec ? {} : { background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                    >
                      {ec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-hint)" }}>
                Preview (row 1)
              </p>
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center"
                style={{ width: 200, height: 200, background: bgColor, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
              >
                {previewDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewDataUrl} alt="QR preview" width={200} height={200} />
                ) : (
                  <span className="text-xs" style={{ color: "var(--text-hint)" }}>Generating…</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl px-5 py-2.5 text-sm font-medium"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 rounded-xl px-6 py-2.5 text-sm font-semibold btn-cyan"
            >
              Generate {rows.length} QR code{rows.length !== 1 ? "s" : ""} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Generate / Download ── */}
      {step === 4 && (
        <div className="mx-auto max-w-lg space-y-6 text-center">
          <div>
            <h2 className="mb-1 text-lg font-semibold">
              {generating ? "Generating QR codes…" : zipUrl ? "Your QR codes are ready!" : "Something went wrong"}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {generating
                ? `Processing row ${Math.round((progress / 100) * rows.length)} of ${rows.length}…`
                : zipUrl
                ? `${rows.length} QR code${rows.length !== 1 ? "s" : ""} packaged into a ZIP file with summary.csv`
                : "An error occurred. Please try again."}
            </p>
          </div>

          {/* Progress bar */}
          <div
            className="relative h-3 overflow-hidden rounded-full"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #06b6d4, #22d3ee)" }}
            />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#06b6d4" }}>{progress}%</p>

          {zipUrl && (
            <a
              href={zipUrl}
              download={`bulk-qr-${bulkType}-${rows.length}.zip`}
              className="inline-block w-full rounded-xl px-6 py-3 text-sm font-semibold btn-cyan text-center"
            >
              Download ZIP ({rows.length} QR codes)
            </a>
          )}

          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl px-6 py-2.5 text-sm font-medium"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Generate another batch
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Choose Type", "Add Data", "Customize", "Generate"];
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                style={
                  done || active
                    ? { background: "#06b6d4", color: "#fff" }
                    : { background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-hint)" }
                }
              >
                {done ? "✓" : n}
              </div>
              <span
                className="hidden text-xs sm:block"
                style={{ color: active ? "#06b6d4" : "var(--text-hint)" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="mb-5 mx-1 h-0.5 w-10 sm:w-16"
                style={{ background: n < step ? "#06b6d4" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
