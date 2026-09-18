import { createResourceHooks } from "./useResource";
import type { BusRoute } from "@/types/master-data";
import type { toRoutePayload } from "@/schemas/route.schema";

type RoutePayload = ReturnType<typeof toRoutePayload>;

export const {
  useList: useRoutes,
  useCreate: useCreateRoute,
  useUpdate: useUpdateRoute,
  useDelete: useDeleteRoute,
} = createResourceHooks<BusRoute, RoutePayload, Partial<RoutePayload> & { isActive?: boolean }>(
  "/routes",
  "routes"
);
