(async function () {
  const cfg = window.FOSL_CONFIG;
  const status = document.getElementById("status");
  const grid = document.getElementById("grid");

  if (!cfg?.apiBase || !cfg?.publishableKey) {
    status.textContent = "Copy config.example.js to config.js and set apiBase + publishableKey.";
    return;
  }

  try {
    const meRes = await fetch(`${cfg.apiBase}/api/v1/storefront/me`, {
      headers: { Authorization: `Bearer ${cfg.publishableKey}` },
    });
    const meJson = await meRes.json();
    if (!meRes.ok) throw new Error(meJson.error || "Storefront auth failed");

    const res = await fetch(`${cfg.apiBase}/api/v1/products?scope=operator`, {
      headers: { Authorization: `Bearer ${cfg.publishableKey}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Catalog failed");

    const products = json.data || [];
    status.textContent = `${meJson.data.name} — ${products.length} products`;
    grid.innerHTML = products
      .map(
        (p) => `
      <article class="card">
        <h2>${p.title}</h2>
        <p>${p.vendorName}</p>
        <p class="price">$${(p.priceCents / 100).toFixed(2)}</p>
      </article>`
      )
      .join("");
  } catch (err) {
    status.textContent = err instanceof Error ? err.message : "Failed to load shop";
  }
})();
