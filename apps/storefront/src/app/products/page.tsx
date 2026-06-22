import { products } from "@fosl/mocks";
import { ProductCatalogCard } from "@/components/product-catalog-card";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="font-semibold">Filters</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium text-slate-700">Product type</p>
              <label className="mt-2 flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Physical
              </label>
              <label className="mt-1 flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Digital
              </label>
              <label className="mt-1 flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Lead gen
              </label>
            </div>
            <div>
              <p className="font-medium text-slate-700">Price</p>
              <input type="range" className="mt-2 w-full" min={0} max={200} />
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">All products</h1>
            <select className="rounded-md border border-slate-200 px-3 py-1.5 text-sm">
              <option>Sort: Featured</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
            </select>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {products.map((p) => (
              <ProductCatalogCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
