"use client";

interface Props {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onDownloadJPEG: () => void;
  disabled: boolean;
}

export default function DownloadButtons({ onDownloadPNG, onDownloadSVG, onDownloadJPEG, disabled }: Props) {
  const btnBase =
    "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all";
  const btnEnabled = "cursor-pointer";
  const btnDisabled = "opacity-40 cursor-not-allowed";

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Download
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={disabled ? undefined : onDownloadPNG}
          disabled={disabled}
          className={[
            btnBase,
            "bg-brand-600 text-white hover:bg-brand-700",
            disabled ? btnDisabled : btnEnabled,
          ].join(" ")}
        >
          <PngIcon />
          PNG
        </button>
        <button
          type="button"
          onClick={disabled ? undefined : onDownloadJPEG}
          disabled={disabled}
          className={[
            btnBase,
            "bg-brand-600 text-white hover:bg-brand-700",
            disabled ? btnDisabled : btnEnabled,
          ].join(" ")}
        >
          <JpegIcon />
          JPEG
        </button>
        <button
          type="button"
          onClick={disabled ? undefined : onDownloadSVG}
          disabled={disabled}
          className={[
            btnBase,
            "border border-brand-600 text-brand-600 hover:bg-brand-50",
            disabled ? btnDisabled : btnEnabled,
          ].join(" ")}
        >
          <SvgIcon />
          SVG
        </button>
      </div>
      {disabled && (
        <p className="text-center text-xs text-gray-400">
          Enter valid content above to enable download
        </p>
      )}
    </div>
  );
}

function PngIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 16l-4-4 4-4M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function JpegIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SvgIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
