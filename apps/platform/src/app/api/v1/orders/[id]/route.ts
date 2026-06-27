import { NextResponse } from "next/server";
import { updateOrderSchema } from "@fosl/contracts";
import { fetchOrderById } from "@/lib/orders-service";
import { databaseRequiredResponse } from "@/lib/database-required";
import { getOrderFromDb, mapDbOrder, updateOrderLineFulfillment, updateOrderStatus } from "@fosl/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, source } = await fetchOrderById(id);
    if (!data) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ data, source });
  } catch (err) {
    console.error("[orders/:id] get failed:", err);
    return NextResponse.json({ error: "Unable to load order." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order update payload." }, { status: 400 });
  }

  try {
    if (parsed.data.status) {
      await updateOrderStatus(
        id,
        parsed.data.status.toUpperCase() as
          | "PROCESSING"
          | "SHIPPED"
          | "DELIVERED"
          | "CANCELLED"
          | "REFUNDED"
          | "LEAD_RECEIVED"
      );
    }

    if (parsed.data.lineUpdates?.length) {
      for (const update of parsed.data.lineUpdates) {
        await updateOrderLineFulfillment(update.orderLineId, {
          trackingNumber: update.trackingNumber,
          downloadUrl: update.downloadUrl,
          leadStatus: update.leadStatus,
        });
      }
    }

    const order = await getOrderFromDb(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ data: mapDbOrder(order), source: "database" });
  } catch (err) {
    console.error("[orders/:id] patch failed:", err);
    return NextResponse.json({ error: "Unable to update order." }, { status: 500 });
  }
}
