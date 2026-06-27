import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { loadProductById, loadRelatedProducts, loadVendorStore } from "@/lib/catalog-loader";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await loadProductById(id, "operator");
  if (!product) notFound();

  const [relatedProducts, vendorStore] = await Promise.all([
    loadRelatedProducts(product),
    loadVendorStore(product.vendorId),
  ]);
  const moreFromVendor = (vendorStore?.products ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      moreFromVendor={moreFromVendor}
    />
  );
}
