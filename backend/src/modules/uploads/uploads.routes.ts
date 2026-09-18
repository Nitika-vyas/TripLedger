import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { receiptUpload } from "../../lib/uploads";
import { uploadReceiptHandler } from "./uploads.controller";

export const uploadsRouter = Router();

uploadsRouter.use(authMiddleware, tenantMiddleware);

uploadsRouter.post("/receipt", receiptUpload, asyncHandler(uploadReceiptHandler));
