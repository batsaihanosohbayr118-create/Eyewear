import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, description, price, image, featured } = body;

  if (!name || !category || !description || !image) {
    return NextResponse.json(
      { error: "Бүх талбарыг бөглөнө үү." },
      { status: 400 }
    );
  }

  const product = await createProduct({
    name,
    category,
    description,
    price: Number(price) || 0,
    image,
    featured: Boolean(featured),
  });

  return NextResponse.json(product, { status: 201 });
}
