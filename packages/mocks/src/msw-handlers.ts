import { products, mockOrders, getOrderById } from "@fosl/mocks";

/** MSW handlers for Phase A prototype — wire up with setupServer in dev when backend is ready. */
export const foslApiHandlers = [
  {
    method: "GET" as const,
    path: "/api/v1/products",
    handler: () => Response.json({ data: products }),
  },
  {
    method: "GET" as const,
    path: "/api/v1/products/:id",
    handler: (params: { id: string }) => {
      const product = products.find((p) => p.id === params.id);
      if (!product) return new Response(null, { status: 404 });
      return Response.json({ data: product });
    },
  },
  {
    method: "GET" as const,
    path: "/api/v1/orders",
    handler: () => Response.json({ data: mockOrders }),
  },
  {
    method: "GET" as const,
    path: "/api/v1/orders/:id",
    handler: (params: { id: string }) => {
      const order = getOrderById(params.id);
      if (!order) return new Response(null, { status: 404 });
      return Response.json({ data: order });
    },
  },
  {
    method: "GET" as const,
    path: "/api/v1/health",
    handler: () => Response.json({ status: "ok", phase: "A-prototype" }),
  },
];

export type FoslApiHandler = (typeof foslApiHandlers)[number];
