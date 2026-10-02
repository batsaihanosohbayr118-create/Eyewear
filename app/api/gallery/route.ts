import { NextRequest, NextResponse } from "next/server";
import { createGalleryImage, getGalleryImages } from "@/lib/db";
import { isAdmin, saveImage, UploadError } from "@/lib/image-upload";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    try {
      src = await saveImage(file, "gallery");
    } catch (err) {
      const message =
        err instanceof UploadError ? err.message : "Зураг хадгалахад алдаа гарлаа.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
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