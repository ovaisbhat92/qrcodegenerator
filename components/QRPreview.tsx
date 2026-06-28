"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { CustomizationOptions, CornerStyle, QRType } from "@/types/qr";
import { downloadPNG, downloadSVG, downloadJPEG, downloadWebP, getFilename } from "@/lib/download";

export interface QRPreviewHandle {
  downloadPNG: () => void;
  downloadSVG: () => void;
  downloadJPEG: () => void;
  downloadWebP: () => void;
  downloadPDF: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
}

interface QRInstance {
  append(container: HTMLElement): void;
  update(options: Record<string, unknown>): void;
  download(options: { name: string; extension: string }): Promise<void>;
  getRawData(extension: string): Promise<Blob>;
}

export interface UpiCaption {
  payeeName: string;
  amount: string;
}

export interface QRCaption {
  mainText?: string;
  secondaryText?: string;
  labelText: string;
  iconType: "phone" | "link" | "location" | "vcard" | "text";
}

interface Props {
  data: string;
  qrType: QRType;
  options: CustomizationOptions;
  upiCaption?: UpiCaption | null;
  caption?: QRCaption | null;
}

const QR_TYPE_LABELS: Record<QRType, string> = {
  url: "website URL",
  text: "plain text",
  phone: "phone number",
  vcard: "contact card",
  location: "location",
  upi: "UPI payment",
};

let qrModulePromise: Promise<{ default: unknown }> | null = null;
function getQRModule(): Promise<{ default: unknown }> {
  if (!qrModulePromise) {
    qrModulePromise = import("qr-code-styling") as Promise<{ default: unknown }>;
  }
  return qrModulePromise;
}

function mapCornerSquare(style: CornerStyle): "square" | "dot" | "extra-rounded" {
  if (style === "rounded") return "extra-rounded";
  if (style === "circle") return "dot";
  return "square";
}

function mapCornerDot(style: CornerStyle): "square" | "dot" {
  if (style === "rounded" || style === "circle") return "dot";
  return "square";
}

function toQRGradient(g: import("@/types/qr").GradientOptions) {
  return {
    type: g.type,
    rotation: (g.rotation * Math.PI) / 180,
    colorStops: [
      { offset: 0, color: g.startColor },
      { offset: 1, color: g.endColor },
    ],
  };
}

function buildOptions(data: string, opts: CustomizationOptions): Record<string, unknown> {
  const {
    size, margin, errorCorrection, fgColor, bgColor, transparentBg,
    dotStyle, cornerStyle, cornerColor, gradient, cornerGradient, logo,
  } = opts;

  const dotsOptions: Record<string, unknown> = { type: dotStyle };
  if (gradient) {
    dotsOptions.gradient = toQRGradient(gradient);
  } else {
    dotsOptions.color = fgColor;
  }

  const cornersSquareOpts: Record<string, unknown> = { type: mapCornerSquare(cornerStyle) };
  if (cornerGradient) {
    cornersSquareOpts.gradient = toQRGradient(cornerGradient);
  } else {
    cornersSquareOpts.color = cornerColor;
  }

  const base: Record<string, unknown> = {
    width: size,
    height: size,
    data,
    margin,
    qrOptions: { errorCorrectionLevel: errorCorrection },
    dotsOptions,
    backgroundOptions: {
      color: transparentBg ? "rgba(0,0,0,0)" : bgColor,
    },
    cornersSquareOptions: cornersSquareOpts,
    cornersDotOptions: {
      type: mapCornerDot(cornerStyle),
      color: fgColor,
    },
  };

  if (logo) {
    base.image = logo.dataUrl;
    base.imageOptions = {
      crossOrigin: "anonymous",
      margin: logo.padding ? 8 : 0,
      hideBackgroundDots: true,
      imageSize: logo.size,
    };
  }

  return base;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function formatAmountText(amount: string): string {
  const n = parseFloat(amount);
  return isNaN(n) ? `₹ ${amount}` : `₹ ${n.toFixed(2)}`;
}

// ── UPI caption canvas (unchanged) ───────────────────────────────────────────

async function buildCaptionCanvas(
  qrDataUrl: string,
  qrSize: number,
  caption: UpiCaption
): Promise<HTMLCanvasElement> {
  const PAD = Math.round(qrSize * 0.065);
  const captionH = Math.round(qrSize * 0.30);
  const borderH = Math.max(3, Math.round(qrSize * 0.006));

  const canvas = document.createElement("canvas");
  canvas.width = qrSize;
  canvas.height = qrSize + captionH;
  const ctx = canvas.getContext("2d")!;

  const img = await loadImage(qrDataUrl);
  ctx.drawImage(img, 0, 0, qrSize, qrSize);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, qrSize, qrSize, captionH);

  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(0, qrSize, qrSize, borderH);

  const FONT = "-apple-system, BlinkMacSystemFont, Arial, sans-serif";

  const nameFontSize = Math.round(qrSize * 0.052);
  ctx.fillStyle = "#0a1628";
  ctx.font = `700 ${nameFontSize}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(caption.payeeName, qrSize / 2, qrSize + PAD, qrSize - PAD * 2);

  const amtFontSize = Math.round(qrSize * 0.065);
  const hasAmt = caption.amount.trim() !== "";
  ctx.fillStyle = hasAmt ? "#06b6d4" : "#94a3b8";
  ctx.font = `800 ${amtFontSize}px ${FONT}`;
  const amtText = hasAmt ? formatAmountText(caption.amount) : "Any Amount";
  ctx.fillText(amtText, qrSize / 2, qrSize + PAD + nameFontSize + 10, qrSize - PAD * 2);

  const labelFontSize = Math.max(10, Math.round(qrSize * 0.025));
  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 ${labelFontSize}px ${FONT}`;
  ctx.textBaseline = "bottom";
  ctx.fillText("SCAN TO PAY", qrSize / 2, qrSize + captionH - Math.round(PAD * 0.7));

  return canvas;
}

// ── Generic caption canvas (phone, url, location, vcard, text) ───────────────

async function buildGenericCaptionCanvas(
  qrDataUrl: string,
  qrSize: number,
  cap: QRCaption
): Promise<HTMLCanvasElement> {
  const hasMain = !!(cap.mainText?.trim());
  const hasSecondary = !!(cap.secondaryText?.trim());
  const PAD = Math.round(qrSize * 0.065);
  // Height: label-only is compact; grows when main/secondary text present
  const captionH = Math.round(
    qrSize * (hasMain && hasSecondary ? 0.34 : hasMain ? 0.27 : 0.16)
  );
  const borderH = Math.max(3, Math.round(qrSize * 0.006));

  const canvas = document.createElement("canvas");
  canvas.width = qrSize;
  canvas.height = qrSize + captionH;
  const ctx = canvas.getContext("2d")!;

  const img = await loadImage(qrDataUrl);
  ctx.drawImage(img, 0, 0, qrSize, qrSize);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, qrSize, qrSize, captionH);

  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(0, qrSize, qrSize, borderH);

  const FONT = "-apple-system, BlinkMacSystemFont, Arial, sans-serif";
  ctx.textAlign = "center";

  if (hasMain) {
    let y = qrSize + PAD;

    const mainFontSize = Math.round(qrSize * 0.052);
    ctx.fillStyle = "#0a1628";
    ctx.font = `700 ${mainFontSize}px ${FONT}`;
    ctx.textBaseline = "top";
    ctx.fillText(cap.mainText!, qrSize / 2, y, qrSize - PAD * 2);
    y += mainFontSize + 8;

    if (hasSecondary) {
      const secFontSize = Math.round(qrSize * 0.038);
      ctx.fillStyle = "#64748b";
      ctx.font = `400 ${secFontSize}px ${FONT}`;
      ctx.fillText(cap.secondaryText!, qrSize / 2, y, qrSize - PAD * 2);
    }
  }

  const labelFontSize = Math.max(10, Math.round(qrSize * 0.025));
  ctx.fillStyle = "#06b6d4";
  ctx.font = `600 ${labelFontSize}px ${FONT}`;
  ctx.textBaseline = "middle";
  const labelY = hasMain
    ? qrSize + captionH - Math.round(PAD * 0.8)
    : qrSize + captionH / 2;
  ctx.textBaseline = hasMain ? "bottom" : "middle";
  ctx.fillText(cap.labelText.toUpperCase(), qrSize / 2, labelY);

  return canvas;
}

async function downloadCanvasAs(
  canvas: HTMLCanvasElement,
  filename: string,
  mime: string,
  quality?: number
): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { resolve(); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 200);
        resolve();
      },
      mime,
      quality
    );
  });
}

const PREVIEW_SIZE = 288;

const QRPreview = forwardRef<QRPreviewHandle, Props>(
  ({ data, qrType, options, upiCaption, caption }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRInstance | null>(null);
    const isMountedRef = useRef(true);

    const qrOptions = useMemo(() => buildOptions(data, options), [data, options]);

    useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; };
    }, []);

    useEffect(() => {
      if (!data) { qrCodeRef.current = null; return; }

      getQRModule().then(({ default: QRCodeStyling }) => {
        if (!isMountedRef.current || !containerRef.current) return;
        type QRCtor = new (opts: Record<string, unknown>) => QRInstance;
        const Ctor = QRCodeStyling as QRCtor;
        // Always recreate: qr-code-styling's update() deep-merges options,
        // so removed keys (e.g. gradient cleared to null) are never unset.
        qrCodeRef.current = new Ctor(qrOptions);
        containerRef.current.innerHTML = "";
        qrCodeRef.current.append(containerRef.current);
      });
    }, [data, qrOptions]);

    useImperativeHandle(ref, () => {
      async function qrToDataUrl(): Promise<string> {
        const blob = await qrCodeRef.current!.getRawData("png");
        return blobToDataUrl(blob);
      }

      async function getCaptionCanvas(dataUrl: string): Promise<HTMLCanvasElement | null> {
        if (upiCaption?.payeeName) return buildCaptionCanvas(dataUrl, options.size, upiCaption);
        if (caption) return buildGenericCaptionCanvas(dataUrl, options.size, caption);
        return null;
      }

      const hasAnyCaption = !!(upiCaption?.payeeName || caption);

      return {
        downloadPNG: () => {
          if (!qrCodeRef.current) return;
          if (!hasAnyCaption) { downloadPNG(qrCodeRef.current, qrType); return; }
          void (async () => {
            const dataUrl = await qrToDataUrl();
            const cnv = await getCaptionCanvas(dataUrl);
            if (cnv) await downloadCanvasAs(cnv, `${getFilename(qrType)}.png`, "image/png");
          })();
        },

        downloadSVG: () => {
          // SVG is for editing — caption excluded by design
          if (qrCodeRef.current) downloadSVG(qrCodeRef.current, qrType);
        },

        downloadJPEG: () => {
          if (!qrCodeRef.current) return;
          if (!hasAnyCaption) { downloadJPEG(qrCodeRef.current, qrType); return; }
          void (async () => {
            const dataUrl = await qrToDataUrl();
            const src = await getCaptionCanvas(dataUrl);
            if (!src) return;
            // JPEG doesn't support alpha — composite over white
            const jpg = document.createElement("canvas");
            jpg.width = src.width; jpg.height = src.height;
            const ctx = jpg.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, jpg.width, jpg.height);
            ctx.drawImage(src, 0, 0);
            await downloadCanvasAs(jpg, `${getFilename(qrType)}.jpg`, "image/jpeg", 0.92);
          })();
        },

        downloadWebP: () => {
          if (!qrCodeRef.current) return;
          if (!hasAnyCaption) { downloadWebP(qrCodeRef.current, qrType); return; }
          void (async () => {
            const dataUrl = await qrToDataUrl();
            const cnv = await getCaptionCanvas(dataUrl);
            if (cnv) await downloadCanvasAs(cnv, `${getFilename(qrType)}.webp`, "image/webp", 0.92);
          })();
        },

        downloadPDF: async () => {
          if (!qrCodeRef.current) return;
          const qrDataUrl = await qrToDataUrl();
          const { jsPDF } = await import("jspdf");
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pageW = 210;
          const pageH = 297;
          const imgSize = 140;

          if (upiCaption?.payeeName) {
            // UPI PDF caption — unchanged
            const captionH = 38;
            const totalH = imgSize + captionH;
            const qrX = (pageW - imgSize) / 2;
            const qrY = (pageH - totalH) / 2;
            const cY = qrY + imgSize;

            pdf.addImage(qrDataUrl, "PNG", qrX, qrY, imgSize, imgSize);

            pdf.setFillColor(255, 255, 255);
            pdf.rect(qrX, cY, imgSize, captionH, "F");

            pdf.setFillColor(6, 182, 212);
            pdf.rect(qrX, cY, imgSize, 0.9, "F");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.setTextColor(10, 22, 40);
            pdf.text(upiCaption.payeeName, pageW / 2, cY + 12, { align: "center" });

            const hasAmt = upiCaption.amount.trim() !== "";
            const amtNum = hasAmt ? parseFloat(upiCaption.amount) : NaN;
            const amtText = hasAmt
              ? `Rs. ${isNaN(amtNum) ? upiCaption.amount : amtNum.toFixed(2)}`
              : "Any Amount";
            pdf.setFontSize(15);
            if (hasAmt) { pdf.setTextColor(6, 182, 212); }
            else { pdf.setTextColor(148, 163, 184); }
            pdf.text(amtText, pageW / 2, cY + 24, { align: "center" });

            pdf.setFontSize(7);
            pdf.setTextColor(148, 163, 184);
            pdf.text("SCAN TO PAY", pageW / 2, cY + 34, { align: "center" });

          } else if (caption) {
            const hasMain = !!(caption.mainText?.trim());
            const hasSecondary = !!(caption.secondaryText?.trim());
            const captionH = hasMain && hasSecondary ? 44 : hasMain ? 34 : 16;
            const totalH = imgSize + captionH;
            const qrX = (pageW - imgSize) / 2;
            const qrY = (pageH - totalH) / 2;
            const cY = qrY + imgSize;

            pdf.addImage(qrDataUrl, "PNG", qrX, qrY, imgSize, imgSize);

            pdf.setFillColor(255, 255, 255);
            pdf.rect(qrX, cY, imgSize, captionH, "F");

            pdf.setFillColor(6, 182, 212);
            pdf.rect(qrX, cY, imgSize, 0.9, "F");

            if (hasMain) {
              pdf.setFont("helvetica", "bold");
              pdf.setFontSize(13);
              pdf.setTextColor(10, 22, 40);
              pdf.text(caption.mainText!, pageW / 2, cY + 11, { align: "center", maxWidth: imgSize - 8 });

              if (hasSecondary) {
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(10);
                pdf.setTextColor(100, 116, 139);
                pdf.text(caption.secondaryText!, pageW / 2, cY + 21, { align: "center", maxWidth: imgSize - 8 });
              }
            }

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(7);
            pdf.setTextColor(6, 182, 212);
            pdf.text(
              caption.labelText.toUpperCase(),
              pageW / 2,
              hasMain ? cY + captionH - 4 : cY + captionH / 2 + 2.5,
              { align: "center" }
            );

          } else {
            pdf.addImage(qrDataUrl, "PNG", (pageW - imgSize) / 2, (pageH - imgSize) / 2, imgSize, imgSize);
          }

          pdf.save(`${getFilename(qrType)}.pdf`);
        },

        copyToClipboard: async () => {
          if (!qrCodeRef.current) return;
          if (!navigator.clipboard || !("ClipboardItem" in window)) {
            throw new Error("unsupported");
          }
          const blob = await qrCodeRef.current.getRawData("png");
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
        },
      };
    }, [qrType, upiCaption, caption, options.size]);

    const scale = options.size > PREVIEW_SIZE ? PREVIEW_SIZE / options.size : 1;

    const bgStyle =
      options.transparentBg
        ? {
            backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%)",
            backgroundSize: "16px 16px",
          }
        : { backgroundColor: "#f9fafb" };

    const ariaLabel = data
      ? `QR code preview for ${QR_TYPE_LABELS[qrType]}`
      : "QR code preview — enter content above to generate";

    const showUpiCaption = !!(upiCaption?.payeeName && data);
    const showGenericCaption = !!(caption && data);
    const anyCaption = showUpiCaption || showGenericCaption;

    return (
      <div style={{ width: PREVIEW_SIZE }}>
        {/* QR code + decorative corner lining (preview only) */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            role="img"
            aria-label={ariaLabel}
            className="overflow-hidden"
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              borderRadius: anyCaption ? "12px 12px 0 0" : "12px",
              boxShadow: "0 0 30px rgba(6,182,212,0.2), 0 0 0 1px rgba(255,255,255,0.06)",
              ...bgStyle,
            }}
          >
            {!data ? (
              <Placeholder />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
              >
                <div
                  ref={containerRef}
                  style={{
                    transform: scale < 1 ? `scale(${scale})` : undefined,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            )}
          </div>
          <CornerLining />
        </div>

        {/* UPI caption card — unchanged */}
        {showUpiCaption && upiCaption && (
          <div
            aria-label="UPI payment caption"
            style={{
              width: PREVIEW_SIZE,
              background: "#ffffff",
              borderTop: "3px solid #06b6d4",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 0 30px rgba(6,182,212,0.2), 0 0 0 1px rgba(255,255,255,0.06)",
              padding: "12px 14px 10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#0a1628",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: 1.2,
                marginBottom: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {upiCaption.payeeName}
            </p>
            <p
              style={{
                color: upiCaption.amount.trim() ? "#06b6d4" : "#94a3b8",
                fontWeight: 800,
                fontSize: "20px",
                lineHeight: 1.2,
                marginBottom: "5px",
              }}
            >
              {upiCaption.amount.trim()
                ? formatAmountText(upiCaption.amount)
                : "Any Amount"}
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Scan to Pay
            </p>
          </div>
        )}

        {/* Generic caption card (phone, url, text, location, vcard) */}
        {showGenericCaption && caption && (
          <div
            aria-label={`${qrType} QR code caption`}
            style={{
              width: PREVIEW_SIZE,
              background: "#ffffff",
              borderTop: "3px solid #06b6d4",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 0 30px rgba(6,182,212,0.2), 0 0 0 1px rgba(255,255,255,0.06)",
              padding: "10px 14px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: caption.mainText ? "5px" : "3px" }}>
              <CaptionIcon type={caption.iconType} />
            </div>
            {caption.mainText && (
              <p
                style={{
                  color: "#0a1628",
                  fontWeight: 700,
                  fontSize: "15px",
                  lineHeight: 1.2,
                  marginBottom: caption.secondaryText ? "2px" : "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {caption.mainText}
              </p>
            )}
            {caption.mainText && caption.secondaryText && (
              <p
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  lineHeight: 1.2,
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {caption.secondaryText}
              </p>
            )}
            <p
              style={{
                color: "#06b6d4",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: caption.mainText ? undefined : "0",
              }}
            >
              {caption.labelText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

QRPreview.displayName = "QRPreview";
export default QRPreview;

// ── Caption icon ──────────────────────────────────────────────────────────────

function CaptionIcon({ type }: { type: QRCaption["iconType"] }) {
  const shared = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24" as const,
    fill: "none" as const,
    stroke: "#06b6d4",
    strokeWidth: 2 as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (type) {
    case "phone":
      return (
        <svg {...shared}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18 2 2 0 012.17 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" />
        </svg>
      );
    case "link":
      return (
        <svg {...shared}>
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      );
    case "location":
      return (
        <svg {...shared}>
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "vcard":
      return (
        <svg {...shared}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "text":
      return (
        <svg {...shared}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    default:
      return null;
  }
}

// ── Corner lining (decorative preview-only frame) ─────────────────────────────

const CL_PAD = 10;  // SVG extends this many px beyond the QR card on each side
const CL_ARM = 22;  // length of each L-arm
const CL_GAP = 3;   // gap between card edge and accent line
const CL_T   = 3;   // stroke thickness

function CornerLining() {
  const total = PREVIEW_SIZE + CL_PAD * 2;
  // corner accent point (where two arms meet) in SVG space
  const c  = CL_PAD - CL_GAP;          // near-side corners (TL / BL / etc.)
  const cR = total - c;                 // far-side corners
  const a  = CL_ARM;

  return (
    <svg
      aria-hidden="true"
      width={total}
      height={total}
      style={{
        position: "absolute",
        top: -CL_PAD,
        left: -CL_PAD,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient
          id="qr-corner-grad"
          gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2={total} y2={total}
        >
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Top-left */}
      <polyline points={`${c + a},${c} ${c},${c} ${c},${c + a}`}
        fill="none" stroke="url(#qr-corner-grad)" strokeWidth={CL_T} strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-right */}
      <polyline points={`${cR - a},${c} ${cR},${c} ${cR},${c + a}`}
        fill="none" stroke="url(#qr-corner-grad)" strokeWidth={CL_T} strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-left */}
      <polyline points={`${c + a},${cR} ${c},${cR} ${c},${cR - a}`}
        fill="none" stroke="url(#qr-corner-grad)" strokeWidth={CL_T} strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-right */}
      <polyline points={`${cR - a},${cR} ${cR},${cR} ${cR},${cR - a}`}
        fill="none" stroke="url(#qr-corner-grad)" strokeWidth={CL_T} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Placeholder ───────────────────────────────────────────────────────────────

function Placeholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300">
      <svg
        className="h-16 w-16"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="4"  y="4"  width="24" height="24" rx="2" />
        <rect x="36" y="4"  width="24" height="24" rx="2" />
        <rect x="4"  y="36" width="24" height="24" rx="2" />
        <rect x="10" y="10" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
        <rect x="42" y="10" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
        <rect x="10" y="42" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
        <line x1="36" y1="36" x2="44" y2="36" />
        <line x1="44" y1="36" x2="44" y2="44" />
        <line x1="44" y1="44" x2="60" y2="44" />
        <line x1="60" y1="44" x2="60" y2="60" />
        <line x1="36" y1="60" x2="60" y2="60" />
        <line x1="36" y1="52" x2="52" y2="52" />
      </svg>
      <p className="text-center text-sm leading-tight">
        Enter content above
        <br />
        to preview your QR code
      </p>
    </div>
  );
}
