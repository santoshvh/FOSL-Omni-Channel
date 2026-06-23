import { NextResponse } from "next/server";
import { products as mockProducts } from "@fosl/mocks";
import { mapDbProduct, prisma } from "@fosl/db";

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.product.findMany({
        where: { published: true },
        include: { vendor: { select: { id: true, name: true } } },
        orderBy: { title: "asc" },
      });
      return NextResponse.json({ data: rows.map(mapDbProduct), source: "database" });
    } catch (err) {
      console.error("[products] database read failed:", err);
    }
  }

  return NextResponse.json({ data: mockProducts, source: "mock" });
}
