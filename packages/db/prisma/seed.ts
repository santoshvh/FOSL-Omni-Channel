import { PrismaClient, ProductType, CatalogSource, SubscriptionState, OrderStatus, LedgerState, IntegrationPlatform, IntegrationStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { products, getShippingForVendor } from "@fosl/mocks";
import { marketplaceVendors, platformOperators } from "@fosl/mocks";
import { generateStorefrontKeyPair } from "../src/storefront-auth";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "demo123";

async function passwordHash() {
  return hash(DEMO_PASSWORD, 10);
}

function mapProductType(t: string): ProductType {
  if (t === "digital") return ProductType.DIGITAL;
  if (t === "lead_gen") return ProductType.LEAD_GEN;
  return ProductType.PHYSICAL;
}

function mapCatalogSource(s: string): CatalogSource {
  if (s === "shopify") return CatalogSource.SHOPIFY;
  if (s === "woocommerce") return CatalogSource.WOOCOMMERCE;
  return CatalogSource.NATIVE;
}

async function main() {
  console.log("Seeding FOSL database…");
  const hashed = await passwordHash();

  const admin = await prisma.user.upsert({
    where: { email: "admin@foslone.com" },
    update: { passwordHash: hashed },
    create: {
      email: "admin@foslone.com",
      name: "Platform Admin",
      passwordHash: hashed,
      roleAssignments: { create: { role: "ADMIN" } },
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "alex@acmecatalog.com" },
    update: { passwordHash: hashed },
    create: {
      email: "alex@acmecatalog.com",
      name: "Alex Rivera",
      passwordHash: hashed,
      roleAssignments: {
        createMany: {
          data: [{ role: "VENDOR" }, { role: "CREATOR" }, { role: "OPERATOR" }],
        },
      },
    },
  });

  const demoAccounts = [
    { email: "vendor@demo.fosl", name: "Demo Vendor", roles: ["VENDOR"] as const },
    { email: "creator@demo.fosl", name: "Demo Creator", roles: ["CREATOR"] as const },
    { email: "operator@demo.fosl", name: "Demo Operator", roles: ["OPERATOR"] as const },
  ];

  for (const account of demoAccounts) {
    await prisma.user.upsert({
      where: { email: account.email },
      update: { passwordHash: hashed },
      create: {
        email: account.email,
        name: account.name,
        passwordHash: hashed,
        roleAssignments: {
          createMany: { data: account.roles.map((role) => ({ role })) },
        },
      },
    });
  }

  const operator = await prisma.operator.upsert({
    where: { slug: "demo-storefront" },
    update: {
      stripeConnectId: "acct_demo_operator",
      stripeConnectOnboardedAt: new Date(),
    },
    create: {
      id: "op_1",
      name: platformOperators[0]?.name ?? "Demo Storefront Co.",
      slug: "demo-storefront",
      contactEmail: platformOperators[0]?.email ?? "ops@demo.fosl.store",
      ownerUserId: demoUser.id,
      subscriptionState: SubscriptionState.ACTIVE,
      planName: "Professional",
      stripeConnectId: "acct_demo_operator",
      stripeConnectOnboardedAt: new Date(),
    },
  });

  const demoKeys = generateStorefrontKeyPair();
  await prisma.storefront.upsert({
    where: { path: "demo" },
    update: {
      publishableKey: demoKeys.publishableKey,
      secretKeyHash: demoKeys.secretKeyHash,
    },
    create: {
      operatorId: operator.id,
      name: "Demo Storefront",
      path: "demo",
      isDefault: true,
      subscriptionState: SubscriptionState.ACTIVE,
      publishableKey: demoKeys.publishableKey,
      secretKeyHash: demoKeys.secretKeyHash,
      allowedOrigins: [],
    },
  });

  const operator2 = await prisma.operator.upsert({
    where: { slug: "urban-market" },
    update: {},
    create: {
      id: "op_2",
      name: platformOperators[1]?.name ?? "Urban Market LLC",
      slug: "urban-market",
      contactEmail: platformOperators[1]?.email ?? "admin@urbanmarket.com",
      subscriptionState: SubscriptionState.GRACE_PERIOD,
      planName: "Starter",
    },
  });

  const vendorUser = await prisma.user.findUnique({ where: { email: "vendor@demo.fosl" } });
  const creatorUser = await prisma.user.findUnique({ where: { email: "creator@demo.fosl" } });
  const operatorUser = await prisma.user.findUnique({ where: { email: "operator@demo.fosl" } });

  if (operatorUser) {
    await prisma.operator.update({
      where: { id: operator2.id },
      data: { ownerUserId: operatorUser.id },
    });
  }

  await prisma.vendorMember.upsert({
    where: { vendorId_userId: { vendorId: "ven_1", userId: demoUser.id } },
    update: { isOwner: true },
    create: { vendorId: "ven_1", userId: demoUser.id, isOwner: true },
  });

  if (vendorUser) {
    await prisma.vendorMember.upsert({
      where: { vendorId_userId: { vendorId: "ven_2", userId: vendorUser.id } },
      update: { isOwner: true },
      create: { vendorId: "ven_2", userId: vendorUser.id, isOwner: true },
    });
  }

  const op2Keys = generateStorefrontKeyPair();
  await prisma.storefront.upsert({
    where: { path: "operator2" },
    update: {
      publishableKey: op2Keys.publishableKey,
      secretKeyHash: op2Keys.secretKeyHash,
    },
    create: {
      operatorId: operator2.id,
      name: "Urban Market Store",
      path: "operator2",
      isDefault: true,
      subscriptionState: SubscriptionState.ACTIVE,
      publishableKey: op2Keys.publishableKey,
      secretKeyHash: op2Keys.secretKeyHash,
      allowedOrigins: [],
    },
  });

  for (const mv of marketplaceVendors) {
    await prisma.vendor.upsert({
      where: { slug: mv.slug },
      update: {
        name: mv.name,
        tagline: mv.tagline,
        logoUrl: mv.logoUrl,
        bannerUrl: mv.bannerUrl,
        ...(mv.id === "ven_1" ? { stripeAccountId: "acct_demo_acme_audio" } : {}),
      },
      create: {
        id: mv.id,
        name: mv.name,
        slug: mv.slug,
        tagline: mv.tagline,
        logoUrl: mv.logoUrl,
        bannerUrl: mv.bannerUrl,
        ...(mv.id === "ven_1" ? { stripeAccountId: "acct_demo_acme_audio" } : {}),
      },
    });

    await prisma.operatorVendor.upsert({
      where: {
        operatorId_vendorId: { operatorId: operator.id, vendorId: mv.id },
      },
      update: { status: "APPROVED" },
      create: {
        operatorId: operator.id,
        vendorId: mv.id,
        status: "APPROVED",
        minCommissionPct: 8,
        defaultCommissionPct: 10,
      },
    });
  }

  for (const vendorId of ["ven_1", "ven_2"]) {
    await prisma.operatorVendor.upsert({
      where: {
        operatorId_vendorId: { operatorId: operator2.id, vendorId },
      },
      update: { status: "APPROVED" },
      create: {
        operatorId: operator2.id,
        vendorId,
        status: "APPROVED",
        minCommissionPct: 8,
        defaultCommissionPct: 10,
      },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { vendorId_sku: { vendorId: p.vendorId, sku: p.sku } },
      update: {
        title: p.title,
        description: p.description,
        fullDescription: p.fullDescription ?? null,
        priceCents: p.priceCents,
        inventory: p.inventory,
        imageUrl: p.imageUrl,
        published: p.published,
      },
      create: {
        id: p.id,
        vendorId: p.vendorId,
        sku: p.sku,
        title: p.title,
        description: p.description,
        fullDescription: p.fullDescription,
        type: mapProductType(p.type),
        priceCents: p.priceCents,
        currency: p.currency,
        inventory: p.inventory,
        imageUrl: p.imageUrl,
        galleryUrls: p.galleryUrls ?? undefined,
        category: p.category,
        tags: p.tags ?? undefined,
        attributes: p.attributes ?? undefined,
        rating: p.rating ?? undefined,
        reviewCount: p.reviewCount ?? 0,
        published: p.published,
        catalogSource: mapCatalogSource(p.catalogSource),
      },
    });
  }

  for (const vendorId of ["ven_1", "ven_4"]) {
    for (const method of getShippingForVendor(vendorId)) {
      await prisma.shippingMethod.upsert({
        where: { id: method.id },
        update: {},
        create: {
          id: method.id,
          vendorId: method.vendorId,
          name: method.name,
          priceCents: method.priceCents,
          estimatedDays: method.estimatedDays,
          zone: method.zone,
        },
      });
    }
  }

  const creatorProfile = await prisma.creatorProfile.upsert({
    where: { userId: demoUser.id },
    update: { stripeConnectId: "acct_demo_creator_alex" },
    create: {
      userId: demoUser.id,
      displayName: "Alex Rivera",
      referralCode: "ALEX2026",
      payoutEmail: demoUser.email,
      stripeConnectId: "acct_demo_creator_alex",
    },
  });

  await prisma.creatorLink.upsert({
    where: {
      creatorId_slug: { creatorId: creatorProfile.id, slug: "CREATOR_ALEX" },
    },
    update: { active: true, operatorId: operator.id },
    create: {
      creatorId: creatorProfile.id,
      operatorId: operator.id,
      slug: "CREATOR_ALEX",
      label: "Alex Rivera — storefront referral",
      cookieDays: 30,
      active: true,
    },
  });

  for (const product of products.slice(0, 3)) {
    await prisma.creatorLink.upsert({
      where: {
        creatorId_slug: { creatorId: creatorProfile.id, slug: `ALEX_${product.id}` },
      },
      update: { productId: product.id, active: true },
      create: {
        creatorId: creatorProfile.id,
        operatorId: operator.id,
        productId: product.id,
        slug: `ALEX_${product.id}`,
        label: product.title,
        cookieDays: 30,
        active: true,
      },
    });
  }

  if (creatorUser) {
    await prisma.creatorProfile.upsert({
      where: { userId: creatorUser.id },
      update: { stripeConnectId: "acct_demo_creator_demo" },
      create: {
        userId: creatorUser.id,
        displayName: "Demo Creator",
        referralCode: "DEMOCREATOR",
        payoutEmail: creatorUser.email,
        stripeConnectId: "acct_demo_creator_demo",
      },
    });
  }

  const demoStorefront = await prisma.storefront.findUnique({ where: { path: "demo" } });
  const alexLink = await prisma.creatorLink.findUnique({
    where: { creatorId_slug: { creatorId: creatorProfile.id, slug: "CREATOR_ALEX" } },
  });

  const integration = await prisma.vendorIntegration.upsert({
    where: { vendorId_platform: { vendorId: "ven_1", platform: IntegrationPlatform.SHOPIFY } },
    update: {
      status: IntegrationStatus.CONNECTED,
      lastSyncAt: new Date(),
      productsSynced: 48,
    },
    create: {
      id: "int_seed_1",
      vendorId: "ven_1",
      platform: IntegrationPlatform.SHOPIFY,
      storeUrl: "https://acme-audio.myshopify.com",
      status: IntegrationStatus.CONNECTED,
      lastSyncAt: new Date(),
      productsSynced: 48,
      shippingZonesSynced: 2,
    },
  });

  await prisma.syncJob.upsert({
    where: { id: "sync_seed_1" },
    update: { status: "completed", completedAt: new Date() },
    create: {
      id: "sync_seed_1",
      integrationId: integration.id,
      entity: "products",
      status: "completed",
      added: 5,
      updated: 2,
      failed: 0,
      completedAt: new Date(),
    },
  });

  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-1043" },
    update: {},
    create: {
      id: "ord_seed_1",
      orderNumber: "ORD-1043",
      customerEmail: "buyer@example.com",
      storefrontId: demoStorefront?.id,
      operatorId: operator.id,
      attributedCreatorLinkId: alexLink?.id,
      status: OrderStatus.PROCESSING,
      subtotalCents: 11498,
      shippingCents: 2000,
      taxCents: 0,
      totalCents: 13498,
      shippingName: "Jane Buyer",
      shippingLine1: "123 Market St",
      shippingCity: "Austin",
      shippingState: "TX",
      shippingPostal: "78701",
      shippingCountry: "US",
      lines: {
        create: [
          {
            id: "ol_seed_1",
            productId: "prod_1",
            vendorId: "ven_1",
            title: "Wireless Bluetooth Headphones",
            type: ProductType.PHYSICAL,
            quantity: 1,
            unitPriceCents: 8999,
            shippingMethodId: "ship_1",
            trackingNumber: "1Z999AA10123456784",
          },
          {
            id: "ol_seed_2",
            productId: "prod_4",
            vendorId: "ven_4",
            title: "Ceramic Travel Mug",
            type: ProductType.PHYSICAL,
            quantity: 1,
            unitPriceCents: 2499,
          },
        ],
      },
    },
    include: { lines: true },
  });

  await prisma.order.upsert({
    where: { orderNumber: "ORD-1038" },
    update: {},
    create: {
      id: "ord_seed_2",
      orderNumber: "ORD-1038",
      customerEmail: "student@example.com",
      storefrontId: demoStorefront?.id,
      operatorId: operator.id,
      status: OrderStatus.DELIVERED,
      subtotalCents: 14900,
      totalCents: 14900,
      lines: {
        create: [
          {
            id: "ol_seed_3",
            productId: "prod_2",
            vendorId: "ven_2",
            title: "E-Commerce Mastery Course",
            type: ProductType.DIGITAL,
            quantity: 1,
            unitPriceCents: 14900,
            downloadUrl: "/downloads/ecm-101.zip",
          },
        ],
      },
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "ORD-1035" },
    update: {},
    create: {
      id: "ord_seed_3",
      orderNumber: "ORD-1035",
      customerEmail: "lead@example.com",
      storefrontId: demoStorefront?.id,
      operatorId: operator.id,
      status: OrderStatus.LEAD_RECEIVED,
      subtotalCents: 0,
      totalCents: 0,
      lines: {
        create: [
          {
            id: "ol_seed_4",
            productId: "prod_3",
            vendorId: "ven_3",
            title: "30-Minute Strategy Consultation",
            type: ProductType.LEAD_GEN,
            quantity: 1,
            unitPriceCents: 0,
            leadStatus: "Vendor contacted — call scheduled Mar 12",
          },
        ],
      },
    },
  });

  if (alexLink) {
    await prisma.commission.upsert({
      where: { id: "comm_seed_1" },
      update: {},
      create: {
        id: "comm_seed_1",
        orderId: order1.id,
        orderLineId: "ol_seed_1",
        creatorId: creatorProfile.id,
        operatorId: operator.id,
        vendorId: "ven_1",
        productId: "prod_1",
        creatorLinkId: alexLink.id,
        amountCents: 900,
        ratePct: 10,
        state: LedgerState.PENDING,
      },
    });
  }

  await prisma.dispute.upsert({
    where: { id: "disp_seed_1" },
    update: {},
    create: {
      id: "disp_seed_1",
      orderNumber: "ORD-1021",
      parties: "Customer vs Acme Audio",
      status: "investigating",
      assignee: "Admin Sarah",
      notes: "Customer reports headphones arrived damaged.",
    },
  });

  await prisma.dispute.upsert({
    where: { id: "disp_seed_2" },
    update: {},
    create: {
      id: "disp_seed_2",
      orderNumber: "ORD-998",
      parties: "Customer vs Bright Labs",
      status: "open",
      notes: "Mug arrived with hairline crack.",
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        id: "aud_seed_1",
        actorEmail: "admin@foslone.com",
        action: "operator.approved",
        resource: "Urban Market LLC",
      },
      {
        id: "aud_seed_2",
        actorEmail: "alex@acmecatalog.com",
        action: "coupon.created",
        resource: "WBH20OFF",
      },
      {
        id: "aud_seed_3",
        actorEmail: "system",
        action: "sync.completed",
        resource: "shopify:acme-audio",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.contactSubmission.createMany({
    data: [
      {
        id: "contact_seed_1",
        name: "Sam Operator",
        email: "sam@retailco.com",
        role: "operator",
        message: "Interested in onboarding our marketplace.",
      },
      {
        id: "contact_seed_2",
        name: "Pat Vendor",
        email: "pat@vendor.io",
        role: "vendor",
        message: "Question about Shopify sync frequency.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.", {
    admin: admin.email,
    operators: [operator.slug, operator2.slug],
    storefronts: ["demo", "operator2"],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
