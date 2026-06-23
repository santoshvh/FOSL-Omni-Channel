import { createHash, randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "./client";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken() {
  const token = randomBytes(RESET_TOKEN_BYTES).toString("hex");
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return { token, expires };
}

export async function issuePasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    return null;
  }

  const { token, expires } = createPasswordResetToken();

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashToken(token),
      expires,
    },
  });

  return { email: user.email, token, expires };
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      token: hashToken(token),
    },
  });

  if (!record || record.expires < new Date()) {
    return { ok: false as const, error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { passwordHash },
    }),
    prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: record.token,
        },
      },
    }),
  ]);

  return { ok: true as const };
}
