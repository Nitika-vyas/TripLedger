import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { AppError } from "../lib/errors";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  if (err instanceof MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 5MB)" : err.message;
    return res.status(400).json({ error: message });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
