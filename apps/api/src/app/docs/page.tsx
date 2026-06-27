export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">FOSL Commerce API</h1>
      <p className="mt-3 text-slate-600">
        OpenAPI specification for the public headless commerce gateway (v1).
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>
          <a href="/openapi.yaml" className="font-medium text-blue-700 hover:underline">
            Download OpenAPI YAML
          </a>
        </li>
        <li>
          <a
            href="https://editor.swagger.io/?url=https://api.foslone.com/openapi.yaml"
            className="font-medium text-blue-700 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Open in Swagger Editor (production URL)
          </a>
        </li>
      </ul>
      <p className="mt-8 text-xs text-slate-500">
        Native routes: categories, vendors, product search, health. Checkout, orders, products,
        shipping, and webhooks proxy to the storefront service via{" "}
        <code className="rounded bg-slate-100 px-1">STOREFRONT_INTERNAL_ORIGIN</code>.
      </p>
    </main>
  );
}
