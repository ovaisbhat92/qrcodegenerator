"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onDownloadJPEG: () => void;
  onDownloadWebP: () => void;
  onDownloadPDF: () => Promise<void>;
  onCopyToClipboard: () => Promise<void>;
  disabled: boolean;
}

type LoadingKey = "pdf" | "copy";

export default function DownloadButtons({
  onDownloadPNG,
  onDownloadSVG,
  onDownloadJPEG,
  onDownloadWebP,
  onDownloadPDF,
  onCopyToClipboard,
  disabled,
}: Props) {
  const [loading, setLoading] = useState<LoadingKey | null>(null);
  const [clipboardSupported, setClipboardSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setClipboardSupported(
      typeof navigator !== "undefined" &&
        !!navigator.clipboard &&
        "ClipboardItem" in window
    );
  }, []);

  function handleRasterDownload(fn: () => void, label: string) {
    if (disabled) return;
    fn();
    toast.success(`${label} saved`, { id: `dl-${label}` });
  }

  async function handlePDF() {
    if (disabled || loading) return;
    setLoading("pdf");
    try {
      await onDownloadPDF();
      toast.success("PDF saved", { id: "dl-pdf" });
    } catch {
      toast.error("PDF export failed", { id: "dl-pdf" });
    } finally {
      setLoading(null);
    }
  }

  async function handleCopy() {
    if (disabled || loading) return;
    setLoading("copy");
    try {
      await onCopyToClipboard();
      toast.success("QR image copied!", { id: "clipboard" });
    } catch (err) {
      const msg = err instanceof Error && err.message === "unsupported"
        ? "Clipboard image copy isn't supported in this browser"
        : "Clipboard copy failed — try a different browser";
      toast.error(msg, { id: "clipboard" });
    } finally {
      setLoading(null);
    }
  }

  const baseBtn =
    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all";
  const solidBtn = `${baseBtn} bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700`;
  const outlineBtn = `${baseBtn} border border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400/10`;
  const disabledCls = "opacity-40 cursor-not-allowed";
  const activeCls = "cursor-pointer";

  const isDisabled = (key?: LoadingKey) => disabled || (loading !== null && loading !== key);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Download
      </p>

      {/* Row 1: Raster formats */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDisabled()}
          onClick={() => handleRasterDownload(onDownloadPNG, "PNG")}
          className={[solidBtn, isDisabled() ? disabledCls : activeCls].join(" ")}
        >
          <ImageIcon /> PNG
        </button>
        <button
          type="button"
          disabled={isDisabled()}
          onClick={() => handleRasterDownload(onDownloadJPEG, "JPEG")}
          className={[solidBtn, isDisabled() ? disabledCls : activeCls].join(" ")}
        >
          <ImageIcon /> JPEG
        </button>
        <button
          type="button"
          disabled={isDisabled()}
          onClick={() => handleRasterDownload(onDownloadWebP, "WebP")}
          className={[solidBtn, isDisabled() ? disabledCls : activeCls].join(" ")}
        >
          <ImageIcon /> WebP
        </button>
      </div>

      {/* Row 2: Vector + document + clipboard */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDisabled()}
          onClick={() => handleRasterDownload(onDownloadSVG, "SVG")}
          className={[outlineBtn, isDisabled() ? disabledCls : activeCls].join(" ")}
        >
          <CodeIcon /> SVG
        </button>
        <button
          type="button"
          disabled={isDisabled("pdf")}
          onClick={handlePDF}
          className={[outlineBtn, isDisabled("pdf") ? disabledCls : activeCls].join(" ")}
        >
          {loading === "pdf" ? <Spinner /> : <PdfIcon />}
          PDF
        </button>
        <button
          type="button"
          disabled={isDisabled("copy") || clipboardSupported === false}
          onClick={clipboardSupported === false ? undefined : handleCopy}
          title={clipboardSupported === false ? "Clipboard image copy isn't supported in this browser" : undefined}
          className={[
            outlineBtn,
            (isDisabled("copy") || clipboardSupported === false) ? disabledCls : activeCls,
          ].join(" ")}
        >
          {loading === "copy" ? <Spinner /> : <CopyIcon />}
          {clipboardSupported === false ? "Copy (n/a)" : "Copy"}
        </button>
      </div>

      {disabled && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Enter valid content above to enable download
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
      <line x1="9" y1="11" x2="11" y2="11" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
