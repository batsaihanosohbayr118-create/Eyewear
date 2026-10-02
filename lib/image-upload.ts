import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Vercel-ийн функцэд ирэх хүсэлт 4.5MB-аас их байж болохгүй. Хөтөч
 * талд зургийг prepareImage()-ээр жижигрүүлдэг тул энэ хязгаар хангалттай.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export class UploadError extends Error {}

/**
 * Зургийг шалгаад Vercel Blob руу хадгална. Серверийн дискэнд (public/)
 * бичих нь Vercel дээр ажилладаггүй тул бүх upload энэ функцээр дамжина.
 */
export async function saveImage(file: File, folder: string): Promise<string> {
  const ext = EXTENSIONS[file.type];
  if (!ext) {
    throw new UploadError("Зөвхөн JPG, PNG, WEBP, AVIF, GIF зураг оруулна уу.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("Зургийн хэмжээ 4MB-аас их байна.");
  }
  const blob = await put(`${folder}/${nanoid(10)}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });
  return blob.url;
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}
