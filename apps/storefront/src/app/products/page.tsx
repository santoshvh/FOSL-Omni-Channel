import { Suspense } from "react";
import { ProductsListing } from "@/components/products-listing";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-slate-500">Loading products…</div>}>
      <ProductsListing />
    </Suspense>
  );
}
