"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setPrefillData } from "@/lib/qrPrefill";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const ACCEPT = ".jpg,.jpeg,.png,.webp,.bmp,.gif";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const QR_MAX_CHARS = 1000;
const QR_WARN_CHARS = 800;

export default function ImageToTextTool() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);

  const runOCR = useCallback(async (file: File) => {
    if (file.size > MAX_BYTES) {
      setStatus("error");
      setErrorMsg("File is too large. Maximum size is 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStatus("loading");
    setProgress(0);
    setStatusMsg("Loading OCR engine…");
    setText("");
    setErrorMsg("");

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setStatus("processing");
            setProgress(Math.round(m.progress * 100));
            setStatusMsg(`Recognizing text… ${Math.round(m.progress * 100)}%`);
          } else {
            setStatusMsg(m.status.charAt(0).toUpperCase() + m.status.slice(1) + "…");
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const extracted = data.text.trim();
      if (!extracted) {
        setStatus("error");
        setErrorMsg("No text found in this image. Try a clearer photo with readable text.");
        return;
      }
      setText(extracted);
      setStatus("done");
      setProgress(100);
      setStatusMsg("Done!");
    } catch {
      setStatus("error");
      setErrorMsg("OCR failed. Please try again with a different image.");
    }
  }, []);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      runOCR(file);
    },
    [runOCR],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setStatus("idle");
    setProgress(0);
    setStatusMsg("");
    setText("");
    setPreview(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCreateQR = () => {
    const truncated = text.slice(0, QR_MAX_CHARS);
    setPrefillData("text", truncated);
    router.push("/");
  };

  const isWorking = status === "loading" || status === "processing";
  const charCount = text.length;
  const willTruncate = charCount > QR_MAX_CHARS;
  const charWarning = willTruncate
    ? "Text will be truncated to 1000 characters for QR generation"
    : charCount > QR_WARN_CHARS
    ? "Long text will produce a dense QR — consider trimming"
    : null;
  const charWarningLevel = willTruncate ? "red" : "orange";
  const hasText = text.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image for text extraction"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors"
        style={{
          borderColor: dragging ? "#06b6d4" : "var(--border)",
          background: dragging ? "rgba(6,182,212,0.06)" : "var(--bg-surface)",
        }}
      >
        <UploadIcon />
        <div>
          <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            Drag &amp; drop an image here, or click to browse
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-hint)" }}>
            JPG, PNG, WEBP, BMP, GIF · Max 10 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Uploaded image preview"
            className="max-h-64 max-w-full rounded-xl object-contain"
            style={{ border: "1px solid var(--border)" }}
          />
        </div>
      )}

      {/* Progress */}
      {isWorking && (
        <div className="space-y-2">
          <div
            className="overflow-hidden rounded-full"
            style={{ height: "8px", background: "var(--bg-input)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "#06b6d4" }}
            />
          </div>
          <p className="text-center text-sm" style={{ color: "var(--text-hint)" }}>
            {statusMsg}
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Result */}
      {status === "done" && hasText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Extracted Text
              <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-hint)" }}>
                {charCount.toLocaleString()} characters
              </span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                Download .txt
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full rounded-xl p-4 font-mono outline-none"
            style={{
              background: "#0f172a",
              color: "#f1f5f9",
              border: "1px solid var(--border)",
              fontSize: "15px",
              lineHeight: "1.7",
              minHeight: "200px",
              maxHeight: "400px",
              resize: "vertical",
            }}
          />

          {/* Character warning */}
          {charWarning && (
            <p
              className="rounded-lg px-3 py-2 text-xs"
              style={{
                background: charWarningLevel === "red" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
                border: `1px solid ${charWarningLevel === "red" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                color: charWarningLevel === "red" ? "#dc2626" : "#d97706",
              }}
            >
              {charWarningLevel === "red" ? "⛔" : "⚠️"} {charWarning}
            </p>
          )}

          {/* Create QR Code */}
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <p className="mb-3 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Want to create a QR code for this text?
            </p>
            <button
              type="button"
              onClick={handleCreateQR}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
            >
              Create QR Code
            </button>
            {willTruncate && (
              <p className="mt-2 text-xs" style={{ color: "var(--text-hint)" }}>
                Text will be trimmed to 1,000 characters. Edit the textarea above before clicking if needed.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <p
        className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs"
        style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-hint)" }}
      >
        <ShieldIcon />
        All processing happens in your browser using Tesseract.js. Your images are never uploaded to any server.
      </p>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4-4 4M12 4v12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
