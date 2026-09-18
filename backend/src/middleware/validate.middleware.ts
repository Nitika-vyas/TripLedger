import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { BadRequestError } from "../lib/errors";

type Target = "body" | "query" | "params";

export function validate(schema: ZodTypeAny, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(new BadRequestError("Validation failed", result.error.flatten()));
    }

    if (target === "query") {
      // Express 5 exposes `req.query` as a getter with no setter, so a plain
      // assignment throws. Redefine the property instead of reassigning it.
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[target] = result.data;
    }
    next();
  };
}
