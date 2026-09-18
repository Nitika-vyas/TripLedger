import { Request, Response } from "express";

/** Wraps a `(query) => Promise<unknown>` service function as an Express handler. */
export function listHandler(serviceFn: (query: any) => Promise<unknown>) {
  return async (req: Request, res: Response) => {
    res.json(await serviceFn(req.query));
  };
}
