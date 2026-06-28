let prefillData: { type: string; content: string } | null = null;

export function setPrefillData(type: string, content: string): void {
  prefillData = { type, content };
}

export function getPrefillData(): { type: string; content: string } | null {
  return prefillData;
}

export function clearPrefillData(): void {
  prefillData = null;
}
