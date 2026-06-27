import type { ShippingMethod } from "@fosl/contracts";
import { getShippingForVendor } from "@fosl/mocks";
import { listShippingMethodsForVendor } from "@fosl/db";

export async function loadShippingForVendor(vendorId: string): Promise<ShippingMethod[]> {
  if (process.env.DATABASE_URL) {
    try {
      return await listShippingMethodsForVendor(vendorId);
    } catch {
      return getShippingForVendor(vendorId);
    }
  }
  return getShippingForVendor(vendorId);
}
