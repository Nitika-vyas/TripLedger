import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { UPLOADS_ROOT } from "./lib/uploads";
import { authRouter } from "./modules/auth/auth.routes";
import { tenantsRouter } from "./modules/tenants/tenants.routes";
import { busesRouter } from "./modules/buses/buses.routes";
import { driversRouter } from "./modules/drivers/drivers.routes";
import { conductorsRouter } from "./modules/conductors/conductors.routes";
import { routesRouter } from "./modules/routes/routes.routes";
import { tripsRouter } from "./modules/trips/trips.routes";
import { usersRouter } from "./modules/users/users.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { reportsRouter } from "./modules/reports/reports.routes";
import { uploadsRouter } from "./modules/uploads/uploads.routes";
import { superAdminBusinessDataRouter } from "./modules/super-admin/business-data.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  // Receipt files are named with a random suffix (see lib/uploads.ts), so a
  // plain static mount is an acceptable tradeoff for MVP scope; revisit with
  // an authenticated stream endpoint if receipts need stricter access control.
  app.use("/uploads", express.static(UPLOADS_ROOT));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRouter);
  app.use("/api/super-admin/tenants", tenantsRouter);
  app.use("/api/super-admin", superAdminBusinessDataRouter);
  app.use("/api/buses", busesRouter);
  app.use("/api/drivers", driversRouter);
  app.use("/api/conductors", conductorsRouter);
  app.use("/api/routes", routesRouter);
  app.use("/api/trips", tripsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/uploads", uploadsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
