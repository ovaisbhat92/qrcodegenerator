"use client";

import { useState, useRef, useCallback } from "react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
export const CHAR_HARD_LIMIT = 1500;
const CHAR_WARN_LIMIT = 800;

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function ImageOcrInput({ value, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload an image file (PNG, JPG, WEBP, BMP, or GIF).");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("Image is too large. Maximum size is 5 MB.");
        return;
      }

      setError(null);
      setLoading(true);
      onChange("");

      // Show thumbnail immediately
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);

      try {
        // Dynamically import tesseract.js — only loaded when user uploads an image
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng");
        const {
          data: { text },
        } = await worker.recognize(file);
        await worker.terminate();

        const cleaned = text.trim();
        if (!cleaned) {
          setError("No text detected in this image. Try a clearer image with visible text.");
          onChange("");
        } else {
          onChange(cleaned.slice(0, CHAR_HARD_LIMIT));
        }
      } catch {
        setError("Failed to extract text. Please try a different image.");
        onChange("");
      } finally {
        setLoading(false);
      }
    },
    [onChange]
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
    setImageUrl(null);
    setError(null);
    setLoading(false);
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  }, [onChange]);

  const overLimit = value.length > CHAR_HARD_LIMIT;
  const overWarn = value.length > CHAR_WARN_LIMIT && !overLimit;
  const pct = Math.min(100, (value.length / CHAR_HARD_LIMIT) * 100);

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {!imageUrl && !loading && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image for OCR"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
          className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-[#06b6d4]/60"
          style={{ borderColor: "var(--border)", background: "var(--bg-input)" }}
        >
          <div className="mb-3 text-4xl" aria-hidden="true">📷</div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Drag & drop an image here, or{" "}
            <span style={{ color: "#06b6d4" }}>click to upload</span>
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-hint)" }}>
            PNG, JPG, WEBP, BMP, GIF · Max 5 MB
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
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
            Extracting text from image…
          </p>
        </div>
      )}

      {/* Result area (shown after OCR completes) */}
      {imageUrl && !loading && (
        <div className="space-y-3">
          {/* Thumbnail row */}
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded image preview"
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
              style={{ border: "1px solid var(--border)" }}
            />
            <div className="flex-1 min-w-0">
              <p className="mb-1 text-xs font-medium" style={{ color: "var(--text-hint)" }}>
                Image uploaded
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs underline underline-offset-2"
                style={{ color: "#06b6d4" }}
              >
                Clear &amp; upload new image
              </button>
            </div>
          </div>

          {/* Extracted text textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Extracted text{" "}
                <span className="text-xs font-normal" style={{ color: "var(--text-hint)" }}>
                  (edit before generating)
                </span>
              </label>
              <span
                className="text-xs font-mono"
                style={{ color: overLimit ? "#ef4444" : overWarn ? "#f59e0b" : "var(--text-hint)" }}
              >
                {value.length} / {CHAR_HARD_LIMIT}
              </span>
            </div>
            <textarea
              rows={5}
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, CHAR_HARD_LIMIT))}
              className="themed-input resize-none"
              placeholder="Extracted text will appear here…"
              aria-label="Extracted text from image"
            />
            {/* Character progress bar */}
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
              ⚠️ Text is too long for a reliable QR code. Please trim it to under 800 characters for
              best scan results.
            </p>
          )}
          {overLimit && (
            <p role="alert" className="text-xs text-red-500">
              Maximum {CHAR_HARD_LIMIT} characters. Please trim the text.
            </p>
          )}
        </div>
      )}

      {/* Error message */}
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
        Your image is processed entirely in your browser using local OCR. It is never uploaded to
        any server.
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
