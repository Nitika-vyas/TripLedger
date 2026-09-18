import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { hashPassword, generateTempPassword } from "../../lib/password";
import { NotFoundError, ConflictError, BadRequestError } from "../../lib/errors";
import { rethrowFkConflict } from "../../lib/prisma-errors";
import type { ListQuery } from "../../lib/zod-helpers";
import type { CreateUserInput, UpdateUserInput } from "./users.schema";

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listUsers(tenantId: string, query: ListQuery) {
  return withTenant(prisma.user, tenantId).findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { OR: [{ fullName: { contains: query.search } }, { email: { contains: query.search } }] }
        : {}),
    },
    select: userSelect,
    orderBy: { createdAt: "asc" },
  });
}

export async function getUser(tenantId: string, id: string) {
  const user = await withTenant(prisma.user, tenantId).findFirst({ where: { id }, select: userSelect });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function createUser(tenantId: string, input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError("A user with this email already exists");

  const temporaryPassword = input.password ?? generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const user = await withTenant(prisma.user, tenantId).create({
    data: {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      role: input.role,
      passwordHash,
    },
  });

  return {
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, isActive: user.isActive },
    temporaryPassword: input.password ? undefined : temporaryPassword,
  };
}

export async function updateUser(tenantId: string, id: string, actingUserId: string, input: UpdateUserInput) {
  if (id === actingUserId) {
    throw new BadRequestError("You cannot change your own account from this screen");
  }

  await getUser(tenantId, id);

  const passwordHash = input.password ? await hashPassword(input.password) : undefined;

  const result = await withTenant(prisma.user, tenantId).updateMany({
    where: { id },
    data: {
      ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(passwordHash ? { passwordHash, refreshTokenHash: null } : {}),
    },
  });
  if (result.count === 0) throw new NotFoundError("User not found");

  return getUser(tenantId, id);
}

export async function deleteUser(tenantId: string, id: string, actingUserId: string) {
  if (id === actingUserId) {
    throw new BadRequestError("You cannot delete your own account");
  }

  await getUser(tenantId, id);
  try {
    await withTenant(prisma.user, tenantId).deleteMany({ where: { id } });
  } catch (err) {
    rethrowFkConflict(err, "Cannot delete this user: they have trips on record. Deactivate them instead.");
  }
}
