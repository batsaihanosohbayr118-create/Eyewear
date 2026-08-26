import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { createGalleryImage, getGalleryImages } from "@/lib/db";

async function saveUploadedFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `gallery/${nanoid(10)}.${ext}`;
  const blob = await put(filename, file, {
    access: "public",
  });
  return blob.url; // Vercel Blob-ийн бүрэн URL буцаана
}

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const urlInput = formData.get("src");
  const alt = String(formData.get("alt") ?? "").trim();
  const span = formData.get("span") === "row-span-2" ? "row-span-2" : "";

  if (!alt) {
    return NextResponse.json(
      { error: "Зургийн тайлбар (alt) шаардлагатай." },
      { status: 400 }
    );
  }

  let src: string;
  if (file instanceof File && file.size > 0) {
    src = await saveUploadedFile(file);
  } else if (typeof urlInput === "string" && urlInput.trim()) {
    src = urlInput.trim();
  } else {
    return NextResponse.json(
      { error: "Зургийн файл эсвэл линк өгнө үү." },
      { status: 400 }
    );
  }

  const image = await createGalleryImage({ src, alt, span });
  return NextResponse.json(image, { status: 201 });
}