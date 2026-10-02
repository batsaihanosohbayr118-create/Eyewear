import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryImage, getGalleryImage, updateGalleryImage } from "@/lib/db";
import { isAdmin, saveImage, UploadError } from "@/lib/image-upload";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    try {
      patch.src = await saveImage(file, "gallery");
    } catch (err) {
      const message =
        err instanceof UploadError ? err.message : "Зураг хадгалахад алдаа гарлаа.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await deleteGalleryImage(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Зураг олдсонгүй." }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}