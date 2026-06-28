import { prisma } from "./client";

export async function getAdminMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [operatorCount, orderCount, revenueAgg, recentOrders] = await Promise.all([
    prisma.operator.count(),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: thirtyDaysAgo } },
      _sum: { totalCents: true },
    }),
    prisma.order.count(),
  ]);

  const syncJobs = await prisma.syncJob.findMany({
    where: { startedAt: { gte: thirtyDaysAgo } },
    select: { status: true },
  });
  const syncTotal = syncJobs.length;
  const syncOk = syncJobs.filter((j) => j.status === "completed" || j.status === "success").length;
  const syncSuccessPct = syncTotal > 0 ? Math.round((syncOk / syncTotal) * 10000) / 100 : 100;

  return {
    operatorCount,
    ordersLast30Days: orderCount,
    totalOrders: recentOrders,
    revenueCentsLast30Days: revenueAgg._sum.totalCents ?? 0,
    checkoutUptimePct: syncSuccessPct,
  };
}

export async function listAdminOperators() {
  const operators = await prisma.operator.findMany({
    include: {
      _count: { select: { storefronts: true, orders: true } },
      orders: {
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { totalCents: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return operators.map((op) => ({
    id: op.id,
    name: op.name,
    slug: op.slug,
    email: op.contactEmail,
    plan: op.planName ?? "—",
    status: op.subscriptionState.toLowerCase(),
    storefrontCount: op._count.storefronts,
    gmvCentsLast30Days: op.orders.reduce((sum, o) => sum + o.totalCents, 0),
    orderCount: op._count.orders,
  }));
}

export async function getAdminOperatorById(id: string) {
  const op = await prisma.operator.findUnique({
    where: { id },
    include: {
      storefronts: true,
      owner: { select: { email: true, name: true } },
      _count: { select: { orders: true, vendorLinks: true, storefronts: true } },
      orders: {
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { totalCents: true },
      },
    },
  });
  if (!op) return null;
  return {
    id: op.id,
    name: op.name,
    slug: op.slug,
    email: op.contactEmail,
    plan: op.planName,
    status: op.subscriptionState.toLowerCase(),
    storefronts: op._count.storefronts,
    storefrontList: op.storefronts,
    owner: op.owner,
    orderCount: op._count.orders,
    vendorCount: op._count.vendorLinks,
    gmvCentsLast30Days: op.orders.reduce((sum, o) => sum + o.totalCents, 0),
  };
}

export async function listDisputes() {
  return prisma.dispute.findMany({ orderBy: { filedAt: "desc" } });
}

export async function getDisputeById(id: string) {
  return prisma.dispute.findUnique({ where: { id } });
}

export async function listAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listContactSubmissions(limit = 100) {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getContactSubmissionById(id: string) {
  return prisma.contactSubmission.findUnique({ where: { id } });
}

export async function getVendorDashboardSummary(vendorId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [vendor, productCount, lines, approvedOperators, integrations, syncJobs] =
    await Promise.all([
      prisma.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } }),
      prisma.product.count({ where: { vendorId, published: true } }),
      prisma.orderLine.findMany({
        where: { vendorId, order: { createdAt: { gte: thirtyDaysAgo } } },
        select: { orderId: true, quantity: true, unitPriceCents: true },
      }),
      prisma.operatorVendor.count({ where: { vendorId, status: "APPROVED" } }),
      prisma.vendorIntegration.findMany({
        where: { vendorId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.syncJob.findMany({
        where: { integration: { vendorId } },
        orderBy: { startedAt: "desc" },
        take: 1,
      }),
    ]);

  const revenueCents = lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const orderCount = new Set(lines.map((line) => line.orderId)).size;
  const lowStock = await prisma.product.count({
    where: { vendorId, published: true, type: "PHYSICAL", inventory: { lte: 20, gt: 0 } },
  });

  return {
    vendor,
    revenueCentsLast30Days: revenueCents,
    orderCountLast30Days: orderCount,
    productCount,
    lowStockCount: lowStock,
    approvedOperatorCount: approvedOperators,
    integrations,
    lastSyncJob: syncJobs[0] ?? null,
  };
}

export async function getCreatorProfileDetail(userId: string) {
  return prisma.creatorProfile.findUnique({
    where: { userId },
    include: {
      links: {
        where: { active: true },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              type: true,
              priceCents: true,
              vendor: { select: { name: true } },
            },
          },
        },
        orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });
}

export async function getAdminHealthMetrics() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const syncJobs = await prisma.syncJob.findMany({
    where: { startedAt: { gte: dayAgo } },
    include: { integration: { select: { platform: true } } },
  });

  const isSuccess = (status: string) => status === "completed" || status === "success";
  const isFailed = (status: string) => status === "failed" || status === "error";

  const total = syncJobs.length;
  const success = syncJobs.filter((j) => isSuccess(j.status)).length;
  const failed = syncJobs.filter((j) => isFailed(j.status)).length;

  function platformRate(platform: "SHOPIFY" | "WOOCOMMERCE") {
    const jobs = syncJobs.filter((j) => j.integration.platform === platform);
    if (jobs.length === 0) return 100;
    const ok = jobs.filter((j) => isSuccess(j.status)).length;
    return Math.round((ok / jobs.length) * 1000) / 10;
  }

  let dbHealthy = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbHealthy = false;
  }

  const queueDepth = await prisma.syncJob.count({
    where: { status: { in: ["running", "pending", "queued"] } },
  });

  return {
    syncSuccessPct24h: total > 0 ? Math.round((success / total) * 1000) / 10 : 100,
    failedSyncs24h: failed,
    queueDepth,
    shopifySuccessPct: platformRate("SHOPIFY"),
    wooSuccessPct: platformRate("WOOCOMMERCE"),
    dbHealthy,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    integrationCount: await prisma.vendorIntegration.count({ where: { status: "CONNECTED" } }),
  };
}

export async function getAdminPaymentMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [byState, recent] = await Promise.all([
    prisma.commission.groupBy({
      by: ["state"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.commission.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { displayName: true } },
        vendor: { select: { name: true } },
      },
    }),
  ]);

  const sumFor = (state: string) =>
    byState.find((r) => r.state.toLowerCase() === state.toLowerCase())?._sum.amountCents ?? 0;

  const paidCents = sumFor("paid");
  const pendingCents = sumFor("pending") + sumFor("cleared");

  return {
    commissionPaidCents30d: paidCents,
    commissionPendingCents30d: pendingCents,
    recentPayouts: recent.map((row) => ({
      id: row.id,
      party: row.vendor?.name ?? row.creator.displayName ?? "Unknown",
      type: row.vendorId ? "Vendor" : "Creator",
      amountCents: row.amountCents,
      state: row.state.toLowerCase(),
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

export async function listCreatorsForOperator(operatorId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const profiles = await prisma.creatorProfile.findMany({
    where: { links: { some: { operatorId } } },
    include: {
      user: { select: { name: true, email: true } },
      links: { where: { operatorId }, select: { clickCount: true } },
      commissions: {
        where: { operatorId, createdAt: { gte: thirtyDaysAgo } },
        select: { amountCents: true },
      },
    },
    orderBy: { displayName: "asc" },
  });

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.displayName ?? profile.user.name ?? profile.user.email,
    referralCode: profile.referralCode,
    clicks30d: profile.links.reduce((sum, link) => sum + link.clickCount, 0),
    revenueCents30d: profile.commissions.reduce((sum, c) => sum + c.amountCents, 0),
    status: "active",
  }));
}

export async function listCreatorLinksForUser(userId: string) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId },
    include: {
      links: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              type: true,
              priceCents: true,
              vendor: { select: { name: true } },
            },
          },
        },
        orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });
  return profile;
}

export async function listCommissionsForCreator(creatorId: string) {
  return prisma.commission.findMany({
    where: { creatorId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getCommissionTotalsForCreator(creatorId: string) {
  const rows = await prisma.commission.groupBy({
    by: ["state"],
    where: { creatorId },
    _sum: { amountCents: true },
  });
  const totals: Record<string, number> = {};
  for (const row of rows) {
    totals[row.state.toLowerCase()] = row._sum.amountCents ?? 0;
  }
  return totals;
}
