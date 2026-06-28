"use client";

import { useState, useRef, useCallback } from "react";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const CHAR_HARD_LIMIT = 1500;
const CHAR_WARN_LIMIT = 800;

type PageRange = "all" | "first" | "first-two";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

async function extractFromPdf(data: ArrayBuffer, range: PageRange): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.mjs", window.location.origin).href;

  const pdf = await getDocument({ data: new Uint8Array(data.slice(0)) }).promise;
  const totalPages = pdf.numPages;

  const pagesToRead: number[] = [];
  if (range === "first") {
    pagesToRead.push(1);
  } else if (range === "first-two") {
    pagesToRead.push(1);
    if (totalPages >= 2) pagesToRead.push(2);
  } else {
    for (let i = 1; i <= totalPages; i++) pagesToRead.push(i);
  }

  const parts: string[] = [];
  for (const n of pagesToRead) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    const pageText = (content.items as { str?: string }[])
      .map((item) => item.str ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) parts.push(pageText);
  }
  return parts.join(" ");
}

export default function PdfTextInput({ value, onChange }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState<PageRange>("all");
  const [fullText, setFullText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<ArrayBuffer | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("Please upload a PDF file.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("PDF is too large. Maximum size is 10 MB.");
        return;
      }

      setError(null);
      setLoading(true);
      setFileName(file.name);
      onChange("");
      setFullText("");
      setPageRange("all");

      try {
        const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
        GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.mjs", window.location.origin).href;

        const arrayBuffer = await file.arrayBuffer();
        // Store a copy so later page-range changes can re-read the buffer safely
        bufferRef.current = arrayBuffer.slice(0);

        const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const numPages = pdf.numPages;
        setPageCount(numPages);

        // Extract all pages from the already-loaded document (no second getDocument call)
        const parts: string[] = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = (content.items as { str?: string }[])
            .map((item) => item.str ?? "")
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (pageText) parts.push(pageText);
        }

        const text = parts.join(" ");
        setFullText(text);
        onChange(text.slice(0, CHAR_HARD_LIMIT));
      } catch (err) {
        console.error("PDF extraction error:", err);
        setError(
          "Failed to extract text from this PDF. The file may be scanned (image-only) or password-protected."
        );
        setFileName(null);
      } finally {
        setLoading(false);
      }
    },
    [onChange]
  );

  const handlePageRangeChange = useCallback(
    async (range: PageRange) => {
      if (loading || !bufferRef.current || !pageCount) return;
      setPageRange(range);
      setLoading(true);
      try {
        const text = await extractFromPdf(bufferRef.current, range);
        setFullText(text);
        onChange(text.slice(0, CHAR_HARD_LIMIT));
      } catch (err) {
        console.error("PDF re-extraction error:", err);
        setError("Failed to re-extract text.");
      } finally {
        setLoading(false);
      }
    },
    [loading, pageCount, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleClear = useCallback(() => {
    setFileName(null);
    setPageCount(0);
    setPageRange("all");
    setFullText("");
    setError(null);
    setLoading(false);
    onChange("");
    bufferRef.current = null;
    if (fileRef.current) fileRef.current.value = "";
  }, [onChange]);

  const overLimit = value.length > CHAR_HARD_LIMIT;
  const overWarn = value.length > CHAR_WARN_LIMIT && !overLimit;
  const pct = Math.min(100, (value.length / CHAR_HARD_LIMIT) * 100);
  const pdfHasTooMuch = fullText.length > CHAR_WARN_LIMIT;

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {!fileName && !loading && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload PDF for text extraction"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
          className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-[#06b6d4]/60"
          style={{ borderColor: "var(--border)", background: "var(--bg-input)" }}
        >
          <div className="mb-3 text-4xl" aria-hidden="true">
            📄
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Drag & drop a PDF here, or{" "}
            <span style={{ color: "#06b6d4" }}>click to upload</span>
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-hint)" }}>
            PDF files only · Max 10 MB
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#06b6d4", borderTopColor: "transparent" }}
            role="status"
            aria-label="Extracting text"
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Extracting text from PDF…
          </p>
        </div>
      )}

      {/* File info + result */}
      {fileName && !loading && (
        <div className="space-y-3">
          {/* File info row */}
          <div
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-lg" aria-hidden="true">
                📄
              </span>
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--text-secondary)", maxWidth: "180px" }}
                >
                  {fileName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-hint)" }}>
                  {pageCount} page{pageCount !== 1 ? "s" : ""} ·{" "}
                  {fullText.length.toLocaleString()} characters extracted
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 shrink-0 text-xs underline underline-offset-2"
              style={{ color: "#06b6d4" }}
            >
              Clear
            </button>
          </div>

          {/* Page range selector (only for multi-page PDFs) */}
          {pageCount > 1 && (
            <div className="space-y-1">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Extract from:
              </p>
              <div
                role="group"
                aria-label="Page range"
                className="flex gap-1 rounded-xl p-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                }}
              >
                {(["all", "first", "first-two"] as PageRange[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={pageRange === r}
                    onClick={() => handlePageRangeChange(r)}
                    className={[
                      "flex flex-1 items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                      pageRange === r ? "btn-cyan" : "",
                    ].join(" ")}
                    style={pageRange === r ? {} : { color: "var(--text-secondary)" }}
                  >
                    {r === "all" ? "All pages" : r === "first" ? "Page 1 only" : "Pages 1–2"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF too-long notice */}
          {pdfHasTooMuch && (
            <p
              className="rounded-lg px-3 py-2 text-xs"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                color: "var(--text-hint)",
              }}
            >
              ℹ️ Your PDF contains {fullText.length.toLocaleString()} characters. Only the first{" "}
              {CHAR_HARD_LIMIT} characters fit in a reliable QR code. Edit the text below to
              include what matters most.
            </p>
          )}

          {/* Extracted text textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Document text{" "}
                <span className="text-xs font-normal" style={{ color: "var(--text-hint)" }}>
                  (edit before generating)
                </span>
              </label>
              <span
                className="text-xs font-mono"
                style={{
                  color: overLimit ? "#ef4444" : overWarn ? "#f59e0b" : "var(--text-hint)",
                }}
              >
                {value.length} / {CHAR_HARD_LIMIT}
              </span>
            </div>
            <textarea
              rows={5}
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, CHAR_HARD_LIMIT))}
              className="themed-input resize-none"
              aria-label="Extracted document text"
            />
            {/* Progress bar */}
            <div
              className="h-1 w-full overflow-hidden rounded-full"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-1 rounded-full transition-all duration-200"
                style={{
                  width: `${pct}%`,
                  background: overLimit ? "#ef4444" : overWarn ? "#f59e0b" : "#06b6d4",
                }}
              />
            </div>
          </div>

          {overWarn && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              ⚠️ Text is too long for a reliable QR code. Please trim it to under 800 characters
              for best scan results.
            </p>
          )}
          {overLimit && (
            <p role="alert" className="text-xs text-red-500">
              Maximum {CHAR_HARD_LIMIT} characters. Please trim the text.
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}

      {/* Privacy note */}
      <p
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border)",
          color: "var(--text-hint)",
        }}
      >
        <ShieldIcon />
        Your PDF is processed entirely in your browser. It is never uploaded to any server.
      </p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
