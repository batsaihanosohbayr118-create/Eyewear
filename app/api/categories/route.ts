import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
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

  const category = await createCategory(label.trim());
  return NextResponse.json(category, { status: 201 });
}
