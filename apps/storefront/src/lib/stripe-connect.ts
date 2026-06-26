import type { PaymentSettlementParams } from "@fosl/db";
import { buildPaymentSettlementParams } from "@fosl/db";

export type { ConnectSettlement, PaymentSettlementParams } from "@fosl/db";

/** @deprecated use PaymentSettlementParams */
export type PaymentIntentConnectParams = PaymentSettlementParams & {
  settlement: PaymentSettlementParams["settlement"];
};

export async function buildPaymentIntentConnectParams(
  lines: { productId: string; quantity: number }[],
  amountCents: number,
  operatorId?: string | null
): Promise<PaymentSettlementParams> {
  return buildPaymentSettlementParams(lines, amountCents, operatorId);
}
