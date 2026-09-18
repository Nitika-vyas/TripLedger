import { prisma } from "../../config/prisma";
import { NotFoundError, ConflictError } from "../../lib/errors";
import { hashPassword, generateTempPassword } from "../../lib/password";
import { uniqueTenantSlug } from "../../lib/slug";
import type { CreateTenantInput } from "./tenants.schema";

export async function listTenants() {
  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      contactEmail: true,
      contactPhone: true,
      isActive: true,
      createdAt: true,
      _count: { select: { users: true, buses: true, trips: true } },
    },
  });
}

export async function getTenant(id: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, fullName: true, email: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { buses: true, drivers: true, conductors: true, routes: true, trips: true } },
    },
  });
  if (!tenant) throw new NotFoundError("Tenant not found");
  return tenant;
}

export async function updateTenantStatus(id: string, isActive: boolean) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw new NotFoundError("Tenant not found");

  return prisma.tenant.update({ where: { id }, data: { isActive } });
}

/**
 * Super-admin creates a tenant + its first COMPANY_ADMIN user directly,
 * without that user going through the public self-service signup flow.
 * Returns the generated password once (plaintext) when the caller didn't
 * supply one, so it can be handed to the customer out-of-band.
 */
export async function createTenant(input: CreateTenantInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.adminEmail } });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists");
  }

  const slug = await uniqueTenantSlug(input.companyName);
  const temporaryPassword = input.password ?? generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);

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

  return {
    tenant,
    admin: { id: user.id, email: user.email, fullName: user.fullName },
    // Only surfaced when we generated it — never re-expose a caller-supplied password.
    temporaryPassword: input.password ? undefined : temporaryPassword,
  };
}
