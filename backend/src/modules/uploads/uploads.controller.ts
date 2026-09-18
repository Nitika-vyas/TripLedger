import { Request, Response } from "express";
import { BadRequestError } from "../../lib/errors";
import { toPublicUploadUrl } from "../../lib/uploads";

export async function uploadReceiptHandler(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError("No file uploaded");
  res.status(201).json({ url: toPublicUploadUrl(req.file.path) });
}
