// Хөтөч талд ажиллана: утасны том зургийг (5–15MB) upload хийхээс өмнө
// жижигрүүлж, серверийн 4MB хязгаарт багтаана.

const MAX_DIMENSION = 2400;
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;
const WEB_FRIENDLY = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));
}

export async function prepareImage(file: File): Promise<File> {
  // GIF-ийг canvas-аар дамжуулбал хөдөлгөөн нь алга болно
  if (file.type === "image/gif") return file;
  if (WEB_FRIENDLY.includes(file.type) && file.size <= SKIP_BELOW_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // Safari WebP руу хөрвүүлж чаддаггүй (PNG буцаадаг) — тэр үед JPEG ашиглана
    let blob = await toBlob(canvas, "image/webp");
    if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg");
    if (!blob || blob.size >= file.size) return file;

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${name}.${ext}`, { type: blob.type });
  } catch {
    // Хөтөч энэ төрлийг уншиж чадахгүй бол (жишээ нь HEIC) анхны файлыг
    // илгээж, серверээс тодорхой алдааны мэдээлэл авна.
    return file;
  }
}
