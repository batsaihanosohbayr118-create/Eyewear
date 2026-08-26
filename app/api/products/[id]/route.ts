import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : Promise.resolve(false);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, description, price, image, featured } = body;

  const updated = await updateProduct(params.id, {
    name,
    category,
    description,
    price: price !== undefined ? Number(price) : undefined,
    image,
    featured,
  });

  if (!updated) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await deleteProduct(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
