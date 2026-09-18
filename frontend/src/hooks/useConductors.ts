import { createResourceHooks } from "./useResource";
import type { Conductor } from "@/types/master-data";
import type { toConductorPayload } from "@/schemas/conductor.schema";

type ConductorPayload = ReturnType<typeof toConductorPayload>;

export const {
  useList: useConductors,
  useCreate: useCreateConductor,
  useUpdate: useUpdateConductor,
  useDelete: useDeleteConductor,
} = createResourceHooks<Conductor, ConductorPayload, Partial<ConductorPayload> & { isActive?: boolean }>(
  "/conductors",
  "conductors"
);
