import { PrismaClient, ProductType, CatalogSource, SubscriptionState } from "@prisma/client";
import { hash } from "bcryptjs";
import { products, getShippingForVendor } from "@fosl/mocks";
import { marketplaceVendors, platformOperators } from "@fosl/mocks";

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
    update: {},
    create: {
      id: "op_1",
      name: platformOperators[0]?.name ?? "Demo Storefront Co.",
      slug: "demo-storefront",
      contactEmail: platformOperators[0]?.email ?? "ops@demo.fosl.store",
      ownerUserId: demoUser.id,
      subscriptionState: SubscriptionState.ACTIVE,
      planName: "Professional",
    },
  });

  await prisma.storefront.upsert({
    where: { path: "demo" },
    update: {},
    create: {
      operatorId: operator.id,
      name: "Demo Storefront",
      path: "demo",
      isDefault: true,
      subscriptionState: SubscriptionState.ACTIVE,
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

  await prisma.storefront.upsert({
    where: { path: "operator2" },
    update: {},
    create: {
      operatorId: operator2.id,
      name: "Urban Market Store",
      path: "operator2",
      isDefault: true,
      subscriptionState: SubscriptionState.ACTIVE,
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
