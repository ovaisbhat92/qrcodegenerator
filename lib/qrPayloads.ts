// Strip ASCII control characters (U+0000–U+001F, U+007F) to prevent QR data corruption.
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "");
}

export function generateUrlPayload(url: string): string {
  const cleaned = stripControlChars(url).trim();
  if (!cleaned) return "";
  if (!/^https?:\/\//i.test(cleaned)) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

export function generateTextPayload(text: string): string {
  return stripControlChars(text);
}
