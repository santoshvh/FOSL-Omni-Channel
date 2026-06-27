import { prisma } from "./client";

export type OperatorCommissionRules = {
  platformFeePct: number;
  creatorPct: number;
  operatorPct: number;
  skuOverrides: { sku: string; creatorPct: number }[];
};

const DEFAULT_RULES: OperatorCommissionRules = {
  platformFeePct: 5,
  creatorPct: 10,
  operatorPct: 15,
  skuOverrides: [],
};

function parseRules(raw: unknown): OperatorCommissionRules {
  if (!raw || typeof raw !== "object") return DEFAULT_RULES;
  const obj = raw as Record<string, unknown>;
  const overrides = Array.isArray(obj.skuOverrides)
    ? obj.skuOverrides
        .filter((o): o is { sku: string; creatorPct: number } => {
          return (
            typeof o === "object" &&
            o != null &&
            typeof (o as { sku?: string }).sku === "string" &&
            typeof (o as { creatorPct?: number }).creatorPct === "number"
          );
        })
        .map((o) => ({ sku: o.sku, creatorPct: o.creatorPct }))
    : [];
  return {
    platformFeePct: typeof obj.platformFeePct === "number" ? obj.platformFeePct : DEFAULT_RULES.platformFeePct,
    creatorPct: typeof obj.creatorPct === "number" ? obj.creatorPct : DEFAULT_RULES.creatorPct,
    operatorPct: typeof obj.operatorPct === "number" ? obj.operatorPct : DEFAULT_RULES.operatorPct,
    skuOverrides: overrides,
  };
}

export async function getOperatorCommissionRules(operatorId: string): Promise<OperatorCommissionRules> {
  const op = await prisma.operator.findUnique({
    where: { id: operatorId },
    select: { settings: true },
  });
  if (!op?.settings || typeof op.settings !== "object") return DEFAULT_RULES;
  const settings = op.settings as Record<string, unknown>;
  return parseRules(settings.commissionRules);
}

export async function saveOperatorCommissionRules(
  operatorId: string,
  rules: OperatorCommissionRules
): Promise<OperatorCommissionRules> {
  const op = await prisma.operator.findUnique({
    where: { id: operatorId },
    select: { settings: true },
  });
  const current =
    op?.settings && typeof op.settings === "object"
      ? (op.settings as Record<string, unknown>)
      : {};
  await prisma.operator.update({
    where: { id: operatorId },
    data: {
      settings: { ...current, commissionRules: rules },
    },
  });
  return rules;
}
