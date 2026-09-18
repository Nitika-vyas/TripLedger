import { createResourceHooks } from "./useResource";
import type { Bus } from "@/types/master-data";
import type { toBusPayload } from "@/schemas/bus.schema";

type BusPayload = ReturnType<typeof toBusPayload>;

export const { useList: useBuses, useCreate: useCreateBus, useUpdate: useUpdateBus, useDelete: useDeleteBus } =
  createResourceHooks<Bus, BusPayload, Partial<BusPayload> & { isActive?: boolean }>("/buses", "buses");
