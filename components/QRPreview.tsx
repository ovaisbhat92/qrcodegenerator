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

interface Props {
  data: string;
  qrType: QRType;
  options: CustomizationOptions;
  upiCaption?: UpiCaption | null;
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

function buildOptions(data: string, opts: CustomizationOptions): Record<string, unknown> {
  const {
    size, margin, errorCorrection, fgColor, bgColor, transparentBg,
    dotStyle, cornerStyle, cornerColor, gradient, logo,
  } = opts;

  const dotsOptions: Record<string, unknown> = { type: dotStyle };
  if (gradient) {
    dotsOptions.gradient = {
      type: gradient.type,
      rotation: (gradient.rotation * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: gradient.startColor },
        { offset: 1, color: gradient.endColor },
      ],
    };
  } else {
    dotsOptions.color = fgColor;
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
    cornersSquareOptions: {
      type: mapCornerSquare(cornerStyle),
      color: cornerColor,
    },
    cornersDotOptions: {
      type: mapCornerDot(cornerStyle),
      color: cornerColor,
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

// Builds a canvas with the QR image on top and a styled caption card below.
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

  // QR
  const img = await loadImage(qrDataUrl);
  ctx.drawImage(img, 0, 0, qrSize, qrSize);

  // Caption background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, qrSize, qrSize, captionH);

  // Cyan top border
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(0, qrSize, qrSize, borderH);

  const FONT = "-apple-system, BlinkMacSystemFont, Arial, sans-serif";

  // Payee name
  const nameFontSize = Math.round(qrSize * 0.052);
  ctx.fillStyle = "#0a1628";
  ctx.font = `700 ${nameFontSize}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(caption.payeeName, qrSize / 2, qrSize + PAD, qrSize - PAD * 2);

  // Amount
  const amtFontSize = Math.round(qrSize * 0.065);
  const hasAmt = caption.amount.trim() !== "";
  ctx.fillStyle = hasAmt ? "#06b6d4" : "#94a3b8";
  ctx.font = `800 ${amtFontSize}px ${FONT}`;
  const amtText = hasAmt ? formatAmountText(caption.amount) : "Any Amount";
  ctx.fillText(amtText, qrSize / 2, qrSize + PAD + nameFontSize + 10, qrSize - PAD * 2);

  // Scan to Pay label
  const labelFontSize = Math.max(10, Math.round(qrSize * 0.025));
  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 ${labelFontSize}px ${FONT}`;
  ctx.textBaseline = "bottom";
  ctx.fillText("SCAN TO PAY", qrSize / 2, qrSize + captionH - Math.round(PAD * 0.7));

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
  ({ data, qrType, options, upiCaption }, ref) => {
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

    useImperativeHandle(ref, () => ({
      downloadPNG: () => {
        if (!qrCodeRef.current) return;
        if (upiCaption?.payeeName) {
          void (async () => {
            const blob = await qrCodeRef.current!.getRawData("png");
            const qrDataUrl = await blobToDataUrl(blob);
            const canvas = await buildCaptionCanvas(qrDataUrl, options.size, upiCaption);
            await downloadCanvasAs(canvas, `${getFilename(qrType)}.png`, "image/png");
          })();
        } else {
          downloadPNG(qrCodeRef.current, qrType);
        }
      },
      downloadSVG: () => {
        // SVG is for editing — caption excluded by design
        if (qrCodeRef.current) downloadSVG(qrCodeRef.current, qrType);
      },
      downloadJPEG: () => {
        if (!qrCodeRef.current) return;
        if (upiCaption?.payeeName) {
          void (async () => {
            const blob = await qrCodeRef.current!.getRawData("png");
            const qrDataUrl = await blobToDataUrl(blob);
            const srcCanvas = await buildCaptionCanvas(qrDataUrl, options.size, upiCaption);
            // JPEG doesn't support alpha — composite over white
            const jpgCanvas = document.createElement("canvas");
            jpgCanvas.width = srcCanvas.width;
            jpgCanvas.height = srcCanvas.height;
            const ctx = jpgCanvas.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
            ctx.drawImage(srcCanvas, 0, 0);
            await downloadCanvasAs(jpgCanvas, `${getFilename(qrType)}.jpg`, "image/jpeg", 0.92);
          })();
        } else {
          downloadJPEG(qrCodeRef.current, qrType);
        }
      },
      downloadWebP: () => {
        if (!qrCodeRef.current) return;
        if (upiCaption?.payeeName) {
          void (async () => {
            const blob = await qrCodeRef.current!.getRawData("png");
            const qrDataUrl = await blobToDataUrl(blob);
            const canvas = await buildCaptionCanvas(qrDataUrl, options.size, upiCaption);
            await downloadCanvasAs(canvas, `${getFilename(qrType)}.webp`, "image/webp", 0.92);
          })();
        } else {
          downloadWebP(qrCodeRef.current, qrType);
        }
      },
      downloadPDF: async () => {
        if (!qrCodeRef.current) return;
        const blob = await qrCodeRef.current.getRawData("png");
        const qrDataUrl = await blobToDataUrl(blob);
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = 210;
        const pageH = 297;
        const imgSize = 140;

        if (upiCaption?.payeeName) {
          const captionH = 38;
          const totalH = imgSize + captionH;
          const qrX = (pageW - imgSize) / 2;
          const qrY = (pageH - totalH) / 2;
          const cY = qrY + imgSize;

          pdf.addImage(qrDataUrl, "PNG", qrX, qrY, imgSize, imgSize);

          // Caption background
          pdf.setFillColor(255, 255, 255);
          pdf.rect(qrX, cY, imgSize, captionH, "F");

          // Cyan top border
          pdf.setFillColor(6, 182, 212);
          pdf.rect(qrX, cY, imgSize, 0.9, "F");

          // Payee name
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.setTextColor(10, 22, 40);
          pdf.text(upiCaption.payeeName, pageW / 2, cY + 12, { align: "center" });

          // Amount — jsPDF standard fonts don't include ₹, use "Rs." fallback
          const hasAmt = upiCaption.amount.trim() !== "";
          const amtNum = hasAmt ? parseFloat(upiCaption.amount) : NaN;
          const amtText = hasAmt
            ? `Rs. ${isNaN(amtNum) ? upiCaption.amount : amtNum.toFixed(2)}`
            : "Any Amount";
          pdf.setFontSize(15);
          if (hasAmt) {
            pdf.setTextColor(6, 182, 212);
          } else {
            pdf.setTextColor(148, 163, 184);
          }
          pdf.text(amtText, pageW / 2, cY + 24, { align: "center" });

          // Scan to Pay
          pdf.setFontSize(7);
          pdf.setTextColor(148, 163, 184);
          pdf.text("SCAN TO PAY", pageW / 2, cY + 34, { align: "center" });
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
    }), [qrType, upiCaption, options.size]);

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

    const showCaption = !!(upiCaption?.payeeName && data);

    return (
      <div style={{ width: PREVIEW_SIZE }}>
        {/* QR code */}
        <div
          role="img"
          aria-label={ariaLabel}
          className="overflow-hidden"
          style={{
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
            borderRadius: showCaption ? "12px 12px 0 0" : "12px",
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

        {/* UPI caption card */}
        {showCaption && upiCaption && (
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
      </div>
    );
  }
);

QRPreview.displayName = "QRPreview";
export default QRPreview;

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
