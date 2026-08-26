export const FALLBACK_IMAGE_SRC = "/logo.png";

export function normalizeImageSrc(src: string | null | undefined): string {
  const value = (src ?? "").trim().replace(/\\/g, "/");
  return value.replace(/^(https?:)\/+/i, "$1//");
}

export function isValidImageSrc(src: string | null | undefined): boolean {
  const value = normalizeImageSrc(src);

  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (!/^https?:\/\//i.test(value)) return false;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function imageSrc(
  src: string | null | undefined,
  fallback = FALLBACK_IMAGE_SRC
): string {
  const value = normalizeImageSrc(src);
  return isValidImageSrc(value) ? value : fallback;
}
