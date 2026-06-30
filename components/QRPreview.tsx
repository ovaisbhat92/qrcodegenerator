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
  iconType: "phone" | "link" | "location" | "vcard" | "text" | "whatsapp" | "email" | "sms" | "wifi";
  labelColor?: string; // defaults to cyan #06b6d4
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
  whatsapp: "WhatsApp message",
  email: "email",
  sms: "SMS message",
  wifi: "WiFi network",
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

function hexToRgb(hex: string): [number, number, number] {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [6, 182, 212];
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

  ctx.fillStyle = cap.labelColor ?? "#06b6d4";
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
  ctx.fillStyle = cap.labelColor ?? "#06b6d4";
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

            const [clr, clg, clb] = hexToRgb(caption.labelColor ?? "#06b6d4");
            pdf.setFillColor(255, 255, 255);
            pdf.rect(qrX, cY, imgSize, captionH, "F");

            pdf.setFillColor(clr, clg, clb);
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
            pdf.setTextColor(clr, clg, clb);
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
        : { backgroundColor: options.bgColor };

    const ariaLabel = data
      ? `QR code preview for ${QR_TYPE_LABELS[qrType]}`
      : "QR code preview — enter content above to generate";

    const showUpiCaption = !!(upiCaption?.payeeName && data);
    const showGenericCaption = !!(caption && data);
    const anyCaption = showUpiCaption || showGenericCaption;

    return (
      <div style={{ width: PREVIEW_SIZE }}>
        {/* QR code + Google-style decorations (preview only) */}
        <div style={{ position: "relative", display: "inline-block" }}>

          {/* Layer 0: floating background decorations — hidden on mobile < 480px */}
          <div
            className="hidden min-[480px]:block"
            style={{ position: "absolute", top: -DECO_PAD, left: -DECO_PAD, zIndex: 0, pointerEvents: "none" }}
          >
            <FloatingDecorations />
          </div>

          {/* Layer 2: QR card */}
          <div
            role="img"
            aria-label={ariaLabel}
            className="overflow-hidden"
            style={{
              position: "relative",
              zIndex: 2,
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              borderRadius: anyCaption ? "12px 12px 0 0" : "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
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

          {/* Layer 3: Google-style colored corner brackets */}
          <GoogleCornerBrackets />
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

        {/* Generic caption card (phone, url, text, location, vcard, whatsapp, email, sms) */}
        {showGenericCaption && caption && (
          <div
            aria-label={`${qrType} QR code caption`}
            style={{
              width: PREVIEW_SIZE,
              background: "#ffffff",
              borderTop: `3px solid ${caption.labelColor ?? "#06b6d4"}`,
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
                color: caption.labelColor ?? "#06b6d4",
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
    case "whatsapp":
      return (
        <svg {...shared} stroke="#25D366">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      );
    case "email":
      return (
        <svg {...shared}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "sms":
      return (
        <svg {...shared}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <line x1="9" y1="10" x2="15" y2="10" strokeLinecap="round" />
          <line x1="9" y1="14" x2="13" y2="14" strokeLinecap="round" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...shared}>
          <path d="M5 12.55a11 11 0 0114.08 0" />
          <path d="M1.42 9a16 16 0 0121.16 0" />
          <path d="M8.53 16.11a6 6 0 016.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      );
    default:
      return null;
  }
}

// ── Google-style decorations (preview-only) ───────────────────────────────────

const DECO_PAD = 48;  // space on each side of the card for decorations
const C_OFF = 8;      // bracket offset outside card corner
const C_ARM = 30;     // bracket arm length
const C_SW  = 5.5;   // bracket stroke width

// SVG coordinate helpers — card occupies (DECO_PAD, DECO_PAD) to
// (DECO_PAD+PREVIEW_SIZE, DECO_PAD+PREVIEW_SIZE) = (48,48)→(336,336)
const _C  = DECO_PAD;                    // 48
const _CE = DECO_PAD + PREVIEW_SIZE;     // 336
const _MX = DECO_PAD + PREVIEW_SIZE / 2; // 192
const _MY = DECO_PAD + PREVIEW_SIZE / 2; // 192
const _T  = PREVIEW_SIZE + DECO_PAD * 2; // 384

// Bracket corner points (just outside card corners)
const TL = { x: _C  - C_OFF, y: _C  - C_OFF }; // (40, 40)
const TR = { x: _CE + C_OFF, y: _C  - C_OFF }; // (344, 40)
const BL = { x: _C  - C_OFF, y: _CE + C_OFF }; // (40, 344)
const BR = { x: _CE + C_OFF, y: _CE + C_OFF }; // (344, 344)

function GoogleCornerBrackets() {
  return (
    <svg
      aria-hidden="true"
      width={_T}
      height={_T}
      style={{ position: "absolute", top: -DECO_PAD, left: -DECO_PAD, pointerEvents: "none", zIndex: 3, overflow: "visible" }}
    >
      {/* TL — Google green */}
      <path d={`M ${TL.x + C_ARM} ${TL.y} Q ${TL.x} ${TL.y} ${TL.x} ${TL.y + C_ARM}`}
        fill="none" stroke="#34A853" strokeWidth={C_SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* TR — Google yellow */}
      <path d={`M ${TR.x - C_ARM} ${TR.y} Q ${TR.x} ${TR.y} ${TR.x} ${TR.y + C_ARM}`}
        fill="none" stroke="#FBBC04" strokeWidth={C_SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* BL — Google blue */}
      <path d={`M ${BL.x + C_ARM} ${BL.y} Q ${BL.x} ${BL.y} ${BL.x} ${BL.y - C_ARM}`}
        fill="none" stroke="#4285F4" strokeWidth={C_SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* BR — Google red */}
      <path d={`M ${BR.x - C_ARM} ${BR.y} Q ${BR.x} ${BR.y} ${BR.x} ${BR.y - C_ARM}`}
        fill="none" stroke="#EA4335" strokeWidth={C_SW} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FloatingDecorations() {
  return (
    <svg aria-hidden="true" width={_T} height={_T} style={{ display: "block", overflow: "visible" }}>
      {/* ── Curved lines ── */}
      {/* Left — blue */}
      <path d={`M 15 ${_C + 100} Q -5 ${_MY} 15 ${_CE - 100}`}
        fill="none" stroke="#4285F4" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />
      {/* Right — red */}
      <path d={`M ${_T - 15} ${_C + 100} Q ${_T + 5} ${_MY} ${_T - 15} ${_CE - 100}`}
        fill="none" stroke="#EA4335" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />
      {/* Top — green */}
      <path d={`M ${_C + 64} 20 Q ${_MX} 4 ${_CE - 64} 20`}
        fill="none" stroke="#34A853" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />
      {/* Bottom — yellow */}
      <path d={`M ${_C + 64} ${_T - 20} Q ${_MX} ${_T - 4} ${_CE - 64} ${_T - 20}`}
        fill="none" stroke="#FBBC04" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />
      {/* Left accent — yellow */}
      <path d={`M 8 ${_C + 68} Q -8 ${_C + 80} 8 ${_C + 92}`}
        fill="none" stroke="#FBBC04" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
      {/* Right accent — green */}
      <path d={`M ${_T - 8} ${_CE - 92} Q ${_T + 8} ${_CE - 80} ${_T - 8} ${_CE - 68}`}
        fill="none" stroke="#34A853" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />

      {/* ── Floating dots ── */}
      {/* Top-right cluster */}
      <circle cx={_CE - 12} cy={_C - 22} r="3"   fill="#EA4335" opacity="0.8" />
      <circle cx={_CE + 4}  cy={_C - 30} r="2"   fill="#4285F4" opacity="0.75" />
      <circle cx={_CE + 14} cy={_C - 14} r="2.5" fill="#FBBC04" opacity="0.8" />
      {/* Bottom-left cluster */}
      <circle cx={_C + 12}  cy={_CE + 22} r="3"   fill="#34A853" opacity="0.8" />
      <circle cx={_C - 4}   cy={_CE + 30} r="2"   fill="#EA4335" opacity="0.75" />
      <circle cx={_C + 24}  cy={_CE + 34} r="2.5" fill="#4285F4" opacity="0.8" />
      {/* Top-left cluster */}
      <circle cx={_C - 20}  cy={_C + 12}  r="2"   fill="#FBBC04" opacity="0.75" />
      <circle cx={_C - 30}  cy={_C + 26}  r="2.5" fill="#34A853" opacity="0.75" />
      {/* Bottom-right cluster */}
      <circle cx={_CE + 20} cy={_CE - 12} r="2"   fill="#FBBC04" opacity="0.75" />
      <circle cx={_CE + 30} cy={_CE - 26} r="2.5" fill="#34A853" opacity="0.75" />
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
