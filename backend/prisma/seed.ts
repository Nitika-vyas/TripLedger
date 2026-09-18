import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@example.com";
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
  const demoAdminEmail = process.env.SEED_DEMO_ADMIN_EMAIL ?? "admin@demobus.com";
  const demoAdminPassword = process.env.SEED_DEMO_ADMIN_PASSWORD ?? "ChangeMe123!";

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      passwordHash: await bcrypt.hash(superAdminPassword, 12),
      fullName: "Super Admin",
      globalRole: "SUPER_ADMIN",
    },
  });
  console.log(`Super admin ready: ${superAdmin.email}`);

  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "demo-bus-company" },
    update: {},
    create: {
      name: "Demo Bus Company",
      slug: "demo-bus-company",
      contactEmail: demoAdminEmail,
    },
  });

  const demoAdmin = await prisma.user.upsert({
    where: { email: demoAdminEmail },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: demoAdminEmail,
      passwordHash: await bcrypt.hash(demoAdminPassword, 12),
      fullName: "Demo Admin",
      role: "COMPANY_ADMIN",
    },
  });
  console.log(`Demo tenant ready: ${demoTenant.slug}, admin: ${demoAdmin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
