import { prisma } from "../../config/prisma";
import { hashPassword, verifyPassword } from "../../lib/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import { ConflictError, UnauthorizedError } from "../../lib/errors";
import { uniqueTenantSlug } from "../../lib/slug";
import type { SignupInput, LoginInput } from "./auth.schema";
import bcrypt from "bcrypt";

async function issueTokens(user: { id: string; tenantId: string | null; role: any; globalRole: any }) {
  const accessToken = signAccessToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    globalRole: user.globalRole,
  });
  const refreshToken = signRefreshToken({ userId: user.id });
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  return { accessToken, refreshToken };
}

export async function signup(input: SignupInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.adminEmail } });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists");
  }

  const slug = await uniqueTenantSlug(input.companyName);
  const passwordHash = await hashPassword(input.password);

  const { tenant, user } = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: input.companyName,
        slug,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
      },
    });

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        email: input.adminEmail,
        passwordHash,
        fullName: input.adminFullName,
        role: "COMPANY_ADMIN",
      },
    });

    return { tenant, user };
  });

  const tokens = await issueTokens(user);
  return { tenant, user, ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.refreshTokenHash) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) {
    // Possible token reuse/theft — revoke to be safe.
    await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: null } });
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
}

export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      globalRole: true,
      tenantId: true,
      tenant: { select: { id: true, name: true, slug: true } },
    },
  });
}
