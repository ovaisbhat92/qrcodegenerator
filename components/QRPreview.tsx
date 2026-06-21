"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { CustomizationOptions, CornerStyle } from "@/types/qr";
import { downloadPNG, downloadSVG, downloadJPEG, downloadWebP, getFilename } from "@/lib/download";
import type { QRType } from "@/types/qr";

export interface QRPreviewHandle {
  downloadPNG: () => void;
  downloadSVG: () => void;
  downloadJPEG: () => void;
  downloadWebP: () => void;
  downloadPDF: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
}

// Structural type for the qr-code-styling instance (avoids importing the class at module level).
interface QRInstance {
  append(container: HTMLElement): void;
  update(options: Record<string, unknown>): void;
  download(options: { name: string; extension: string }): Promise<void>;
  getRawData(extension: string): Promise<Blob>;
}

interface Props {
  data: string;
  qrType: QRType;
  options: CustomizationOptions;
}

// Module-level cache so the dynamic import only happens once.
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

const PREVIEW_SIZE = 288;

const QRPreview = forwardRef<QRPreviewHandle, Props>(
  ({ data, qrType, options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRInstance | null>(null);
    const isMountedRef = useRef(true);

    const qrOptions = useMemo(() => buildOptions(data, options), [data, options]);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (!data) {
        qrCodeRef.current = null;
        return;
      }

      getQRModule().then(({ default: QRCodeStyling }) => {
        if (!isMountedRef.current || !containerRef.current) return;
        type QRCtor = new (opts: Record<string, unknown>) => QRInstance;
        const Ctor = QRCodeStyling as QRCtor;
        if (!qrCodeRef.current) {
          qrCodeRef.current = new Ctor(qrOptions);
          containerRef.current.innerHTML = "";
          qrCodeRef.current.append(containerRef.current);
        } else {
          qrCodeRef.current.update(qrOptions);
        }
      });
    }, [data, qrOptions]);

    useImperativeHandle(ref, () => ({
      downloadPNG: () => {
        if (qrCodeRef.current) downloadPNG(qrCodeRef.current, qrType);
      },
      downloadSVG: () => {
        if (qrCodeRef.current) downloadSVG(qrCodeRef.current, qrType);
      },
      downloadJPEG: () => {
        if (qrCodeRef.current) downloadJPEG(qrCodeRef.current, qrType);
      },
      downloadWebP: () => {
        if (qrCodeRef.current) downloadWebP(qrCodeRef.current, qrType);
      },
      downloadPDF: async () => {
        if (!qrCodeRef.current) return;
        const blob = await qrCodeRef.current.getRawData("png");
        const dataUrl = await blobToDataUrl(blob);
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = 210;
        const pageH = 297;
        const imgSize = 140;
        pdf.addImage(dataUrl, "PNG", (pageW - imgSize) / 2, (pageH - imgSize) / 2, imgSize, imgSize);
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
    }));

    const scale = options.size > PREVIEW_SIZE ? PREVIEW_SIZE / options.size : 1;

    const bgStyle =
      options.transparentBg
        ? {
            backgroundImage:
              "repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%)",
            backgroundSize: "16px 16px",
          }
        : { backgroundColor: "#f9fafb" };

    return (
      <div
        className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700"
        style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, ...bgStyle }}
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
