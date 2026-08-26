import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { deleteGalleryImage, getGalleryImage, updateGalleryImage } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

async function saveUploadedFile(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${nanoid(10)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/gallery/${filename}`;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = await getGalleryImage(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Зураг олдсонгүй." }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const urlInput = formData.get("src");
  const altInput = formData.get("alt");
  const spanInput = formData.get("span");

  const patch: {
    src?: string;
    alt?: string;
    span?: "" | "row-span-2";
  } = {};

  if (file instanceof File && file.size > 0) {
    patch.src = await saveUploadedFile(file);
  } else if (typeof urlInput === "string" && urlInput.trim()) {
    patch.src = urlInput.trim();
  }

  if (typeof altInput === "string" && altInput.trim()) {
    patch.alt = altInput.trim();
  }

  if (spanInput === "row-span-2" || spanInput === "") {
    patch.span = spanInput;
  }

  const updated = await updateGalleryImage(params.id, patch);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ok = await deleteGalleryImage(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Зураг олдсонгүй." }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}