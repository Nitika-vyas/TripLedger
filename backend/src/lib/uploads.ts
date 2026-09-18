import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { BadRequestError } from "./errors";

/**
 * Kept at the project root (not under src/) so the path is identical whether
 * running via ts-node-dev (src/server.ts) or the compiled build
 * (dist/server.js) — both are started with the backend folder as cwd.
 */
export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const RECEIPTS_DIR = path.join(UPLOADS_ROOT, "receipts");

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
      cb(new BadRequestError("Missing tenant context"), "");
      return;
    }
    const dir = path.join(RECEIPTS_DIR, tenantId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, randomName);
  },
});

/** Single-file upload middleware for the `file` field, used by POST /api/uploads/receipt. */
export const receiptUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new BadRequestError("Only JPEG, PNG, WEBP, or PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("file");

/** Converts an uploaded file's absolute disk path into the public `/uploads/...` URL path. */
export function toPublicUploadUrl(absolutePath: string): string {
  const relative = path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join("/");
  return `/uploads/${relative}`;
}
