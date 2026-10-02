import { NextRequest, NextResponse } from "next/server";
import { isAdmin, saveImage, UploadError } from "@/lib/image-upload";

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Файл олдсонгүй." }, { status: 400 });
  }

  try {
    const url = await saveImage(file, "uploads");
    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err instanceof UploadError ? err.message : "Зураг хадгалахад алдаа гарлаа.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
