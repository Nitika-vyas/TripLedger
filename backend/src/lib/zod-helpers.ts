import { z } from "zod";

/** Coerces the string query-param values Express gives us ("true"/"false") into booleans. */
export const zBoolQuery = z
  .enum(["true", "false"])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === "true"));

/** Common list-endpoint query params: optional isActive filter + free-text search. */
export const listQuerySchema = z.object({
  isActive: zBoolQuery,
  search: z.string().trim().min(1).max(200).optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

/** Same as listQuerySchema, plus an optional tenantId filter for cross-tenant super-admin views. */
export const superAdminListQuerySchema = listQuerySchema.extend({
  tenantId: z.string().min(1).optional(),
});
export type SuperAdminListQuery = z.infer<typeof superAdminListQuerySchema>;
