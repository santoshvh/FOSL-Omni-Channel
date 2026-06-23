import { http, HttpResponse } from "msw";
import { products } from "./fixtures";
import { mockOrders, getOrderById } from "./hub-data";

export const foslApiHandlers = [
  http.get("/api/v1/health", () =>
    HttpResponse.json({ status: "ok", phase: "A-prototype", mocked: true })
  ),
  http.get("/api/v1/products", () => HttpResponse.json({ data: products })),
  http.get("/api/v1/products/:id", ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ data: product });
  }),
  http.get("/api/v1/orders", () => HttpResponse.json({ data: mockOrders })),
  http.get("/api/v1/orders/:id", ({ params }) => {
    const order = getOrderById(params.id as string);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ data: order });
  }),
  http.post("/api/v1/contact", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return HttpResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    return HttpResponse.json(
      { data: { id: `contact_mock_${Date.now()}`, status: "received", ...body } },
      { status: 201 }
    );
  }),
  http.post("/api/v1/leads", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: "lead_1", status: "received", ...body as object } }, { status: 201 });
  }),
  http.post("/api/v1/checkout/sessions", async () =>
    HttpResponse.json({ data: { sessionId: "cs_test_mock", url: "/checkout/confirmation?type=mixed" } })
  ),
];
