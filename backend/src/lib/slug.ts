import { prisma } from "../config/prisma";

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "tenant"
  );
}

export async function uniqueTenantSlug(base: string): Promise<string> {
  const slug = slugify(base);
  let suffix = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.tenant.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    suffix += 1;
  }
}
