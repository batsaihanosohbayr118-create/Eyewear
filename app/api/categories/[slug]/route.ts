import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : Promise.resolve(false);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { label } = body;

  if (!label || !label.trim()) {
    return NextResponse.json(
      { error: "Ангиллын нэрийг оруулна уу." },
      { status: 400 }
    );
  }

  const updated = await updateCategory(params.slug, label.trim());
  if (!updated) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await deleteCategory(params.slug);
  if (!ok) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
