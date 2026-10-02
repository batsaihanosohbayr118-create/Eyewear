import { NextRequest, NextResponse } from "next/server";
import { reorderGalleryImages } from "@/lib/db";
import { isAdmin } from "@/lib/image-upload";

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ids = body?.ids;

  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json(
      { error: "ids талбар string[] байх ёстой." },
      { status: 400 }
    );
  }

  const images = await reorderGalleryImages(ids);
  return NextResponse.json(images);
}