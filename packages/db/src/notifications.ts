import { prisma } from "./client";

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export async function listUserNotifications(userId: string, limit = 40) {
  return prisma.userNotification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      body: true,
      href: true,
      readAt: true,
      createdAt: true,
    },
  });
}

export async function countUnreadNotifications(userId: string) {
  return prisma.userNotification.count({
    where: { userId, readAt: null },
  });
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const row = await prisma.userNotification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!row) return null;
  if (row.readAt) return row;
  return prisma.userNotification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  const result = await prisma.userNotification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return result.count;
}

export async function deleteNotification(userId: string, notificationId: string) {
  const row = await prisma.userNotification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!row) return false;
  await prisma.userNotification.delete({ where: { id: notificationId } });
  return true;
}

export async function deleteAllNotifications(userId: string) {
  const result = await prisma.userNotification.deleteMany({ where: { userId } });
  return result.count;
}

export async function seedDemoNotifications(userId: string) {
  const existing = await prisma.userNotification.count({ where: { userId } });
  if (existing > 0) return;

  await prisma.userNotification.createMany({
    data: [
      {
        userId,
        title: "New referral click",
        body: "Someone opened your link for Wireless Bluetooth Headphones.",
        href: "/creator/links",
      },
      {
        userId,
        title: "Commission cleared",
        body: "A $12.40 creator commission is ready for the next payout.",
        href: "/creator/payouts",
      },
      {
        userId,
        title: "Catalog sync completed",
        body: "Shopify sync finished — 48 products updated.",
        href: "/vendor/integrations",
        readAt: new Date(Date.now() - 3600_000),
      },
    ],
  });
}
