"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { trackQRScanned } from "@/lib/analytics";

interface Props {
  onGenerateFromResult: (content: string) => void;
}

type Method = "upload" | "camera";
type CameraState = "idle" | "requesting" | "scanning" | "denied" | "unavailable";

function detectContentType(value: string): string {
  if (/^https?:\/\//i.test(value)) return "url";
  if (/^upi:\/\//i.test(value)) return "upi";
  if (/^tel:/i.test(value)) return "phone";
  if (/^BEGIN:VCARD/i.test(value)) return "vcard";
  if (/^geo:/i.test(value)) return "geo";
  return "text";
}

export default function QRScanner({ onGenerateFromResult }: Props) {
  const [method, setMethod] = useState<Method>("upload");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const scanningRef = useRef(false);

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  function resetAll() {
    setResult(null);
    setError(null);
    setCopied(false);
  }

  function handleMethodChange(m: Method) {
    stopCamera();
    setCameraState("idle");
    setMethod(m);
    resetAll();
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    resetAll();

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a PNG, JPG, WebP, or GIF image.");
      return;
    }

    const jsQR = (await import("jsqr")).default;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError("Could not read image."); return; }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
        trackQRScanned({ method: "upload", content_type: detectContentType(code.data) });
      } else {
        setError("No QR code found in this image. Try a clearer or higher-resolution scan.");
      }
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); setError("Could not load image file."); };
    img.src = objectUrl;
  }

  // ── Camera ────────────────────────────────────────────────────────────────

  async function startCamera() {
    resetAll();
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unavailable");
      return;
    }
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      scanningRef.current = true;
      setCameraState("scanning");
      scanFrame();
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCameraState("denied");
      } else {
        setCameraState("unavailable");
      }
    }
  }

  async function scanFrame() {
    if (!scanningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const jsQR = (await import("jsqr")).default;
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      stopCamera();
      setCameraState("idle");
      setResult(code.data);
      trackQRScanned({ method: "camera", content_type: detectContentType(code.data) });
    } else {
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }
  }

  function handleScanAgain() {
    resetAll();
    setCameraState("idle");
    stopCamera();
  }

  // ── Copy ──────────────────────────────────────────────────────────────────

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const isUrl = result ? /^https?:\/\//i.test(result) : false;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* ── Left: input panel ── */}
      <div className="flex-1 space-y-4">
        {/* Method tabs */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
            Scan Method
          </h2>
          <div
            role="group"
            aria-label="Scan method"
            className="mb-5 flex gap-1 rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
          >
            {(["upload", "camera"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m}
                onClick={() => handleMethodChange(m)}
                className={[
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  method === m ? "btn-cyan" : "",
                ].join(" ")}
                style={method === m ? {} : { color: "var(--text-secondary)" }}
              >
                {m === "upload" ? <UploadIcon /> : <CameraIcon />}
                {m === "upload" ? "Upload Image" : "Use Camera"}
              </button>
            ))}
          </div>

          {method === "upload" && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload image containing QR code"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm transition-colors hover:border-brand-500 hover:text-brand-500"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <UploadIcon />
                <span>Click to upload PNG, JPG, WebP, or GIF</span>
              </button>
            </>
          )}

          {method === "camera" && (
            <div className="space-y-3">
              {cameraState === "idle" && (
                <button type="button" onClick={startCamera} className="btn-cyan w-full rounded-lg py-3 text-sm font-semibold">
                  Start Camera
                </button>
              )}
              {cameraState === "requesting" && (
                <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Requesting camera permission…
                </p>
              )}
              {cameraState === "scanning" && (
                <div className="space-y-3">
                  <div
                    className="relative overflow-hidden rounded-xl"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <video
                      ref={videoRef}
                      className="w-full"
                      aria-label="Camera feed for QR code scanning"
                      playsInline
                      muted
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <div className="h-48 w-48 rounded-lg border-2 border-brand-400 opacity-60" />
                    </div>
                  </div>
                  <p className="text-center text-xs" style={{ color: "var(--text-hint)" }}>
                    Point your camera at a QR code to scan it automatically
                  </p>
                  <button
                    type="button"
                    onClick={handleScanAgain}
                    className="btn-ghost w-full rounded-lg py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {cameraState === "denied" && (
                <div
                  className="rounded-xl p-4 text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                  role="alert"
                >
                  <p className="font-semibold text-red-500">Camera permission denied</p>
                  <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                    To enable camera access: open your browser settings → Site permissions → Camera → allow this site.
                  </p>
                </div>
              )}
              {cameraState === "unavailable" && (
                <div
                  className="rounded-xl p-4 text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                  role="alert"
                >
                  <p className="font-semibold text-red-500">Camera not available</p>
                  <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                    No camera was detected. Try the Upload Image method instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hidden canvas used for frame extraction */}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>

        {/* Privacy note */}
        <p
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-hint)" }}
        >
          <ShieldIcon />
          Images and camera feed are processed entirely in your browser and never sent to any server.
        </p>
      </div>

      {/* ── Right: result panel ── */}
      <div className="lg:w-80 xl:w-96">
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
            Result
          </h2>

          {!result && !error && (
            <div className="flex flex-col items-center gap-3 py-8" style={{ color: "var(--text-hint)" }}>
              <ScanIcon />
              <p className="text-center text-sm">
                {method === "upload" ? "Upload an image to decode its QR code" : "Start the camera to scan a QR code"}
              </p>
            </div>
          )}

          {error && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              role="alert"
            >
              <p className="font-semibold text-red-500">Could not decode QR code</p>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
              >
                {isUrl ? (
                  <div className="space-y-2">
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all text-sm font-medium underline"
                      style={{ color: "#06b6d4" }}
                    >
                      {result}
                    </a>
                    <p className="text-xs" style={{ color: "var(--text-hint)" }}>
                      ⚠️ Always verify links before visiting
                    </p>
                  </div>
                ) : (
                  <p
                    className="break-all text-sm"
                    style={{ color: "var(--text-primary)" }}
                    aria-label="Decoded QR code content"
                  >
                    {result}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-ghost flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateFromResult(result)}
                  className="btn-cyan flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold"
                >
                  <QRIcon />
                  Generate QR
                </button>
              </div>

              {method === "camera" && (
                <button
                  type="button"
                  onClick={handleScanAgain}
                  className="btn-ghost w-full rounded-lg py-2 text-sm font-semibold"
                >
                  Scan Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
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

function ScanIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M3 7V5a2 2 0 012-2h2" strokeLinecap="round" />
      <path d="M17 3h2a2 2 0 012 2v2" strokeLinecap="round" />
      <path d="M21 17v2a2 2 0 01-2 2h-2" strokeLinecap="round" />
      <path d="M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
      <path d="M14 14h3v3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17h4v4h-4z" />
    </svg>
  );
}
