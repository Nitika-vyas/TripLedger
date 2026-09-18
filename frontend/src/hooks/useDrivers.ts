import { createResourceHooks } from "./useResource";
import type { Driver } from "@/types/master-data";
import type { toDriverPayload } from "@/schemas/driver.schema";

type DriverPayload = ReturnType<typeof toDriverPayload>;

export const {
  useList: useDrivers,
  useCreate: useCreateDriver,
  useUpdate: useUpdateDriver,
  useDelete: useDeleteDriver,
} = createResourceHooks<Driver, DriverPayload, Partial<DriverPayload> & { isActive?: boolean }>(
  "/drivers",
  "drivers"
);
