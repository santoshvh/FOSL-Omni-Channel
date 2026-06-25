import { NextResponse } from "next/server";
import { products as mockProducts } from "@fosl/mocks/fixtures";

export async function GET() {
  try {
    if (process.env.DATABASE_URL?.trim()) {
      const { mapDbProduct, prisma } = await import("@fosl/db");
      const rows = await prisma.product.findMany({
        where: { published: true },
        include: { vendor: { select: { id: true, name: true } } },
        orderBy: { title: "asc" },
      });
      return NextResponse.json({
        data: rows.map(mapDbProduct),
        source: "database",
      });
    }
  } catch (err) {
    console.error("[products] failed:", err);
  }

  return NextResponse.json({ data: mockProducts, source: "mock" });
}
