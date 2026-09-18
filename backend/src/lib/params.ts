import { Request } from "express";
import { BadRequestError } from "./errors";

/** Express 5 types route params as `string | string[]` (repeated params produce arrays). */
export function idParam(req: Request, name = "id"): string {
  const value = req.params[name];
  if (typeof value !== "string") {
    throw new BadRequestError(`Invalid ${name} parameter`);
  }
  return value;
}
