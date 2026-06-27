import { prisma } from "./client";

export async function getVendorForUserId(userId: string) {
  const member = await prisma.vendorMember.findFirst({
    where: { userId },
    orderBy: [{ isOwner: "desc" }, { createdAt: "asc" }],
    include: { vendor: { select: { id: true, name: true, slug: true } } },
  });
  return member?.vendor ?? null;
}

export async function getDefaultVendorId(): Promise<string | null> {
  const vendor = await prisma.vendor.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return vendor?.id ?? null;
}

export async function getCreatorProfileForUserId(userId: string) {
  return prisma.creatorProfile.findUnique({
    where: { userId },
    select: { id: true, displayName: true, referralCode: true },
  });
}
