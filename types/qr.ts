export type QRType = "url" | "text" | "phone" | "vcard" | "location" | "upi";

export type DotStyle = "square" | "rounded" | "dots" | "extra-rounded";

export type CornerStyle = "square" | "rounded" | "circle";

export type ErrorCorrection = "L" | "M" | "Q" | "H";

export type GradientType = "linear" | "radial";

export interface VCardInput {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  website: string;
  address: string;
}

export interface LocationInput {
  mode: "coordinates" | "mapslink";
  lat: string;
  lng: string;
  mapsLink: string;
}

export interface UpiInput {
  upiId: string;
  payeeName: string;
  amount: string;
  note: string;
}

export interface GradientOptions {
  type: GradientType;
  startColor: string;
  endColor: string;
  rotation: number; // degrees, 0–360
}

export interface LogoOptions {
  dataUrl: string;
  size: number;  // fraction of QR size, 0.1–0.5
  padding: boolean;
}

export interface CustomizationOptions {
  size: number;           // px, 128–1024
  margin: number;         // 0–40
  errorCorrection: ErrorCorrection;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  cornerColor: string;
  gradient: GradientOptions | null;
  cornerGradient: GradientOptions | null;
  logo: LogoOptions | null;
}

export const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  size: 300,
  margin: 10,
  errorCorrection: "H",
  fgColor: "#0a1628",
  bgColor: "#ffffff",
  transparentBg: false,
  dotStyle: "rounded",
  cornerStyle: "rounded",
  cornerColor: "#06b6d4",
  gradient: null,
  cornerGradient: null,
  logo: null,
};
