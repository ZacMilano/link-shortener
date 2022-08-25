import { Request, Response } from "express";
import { Route } from "../types";

export const healthRoute: Route = {
  path: "/health",
  method: "get",
  handler: healthHandler,
};

export function healthHandler() {
  return function (req: Request, res: Response) {
    res.send({ status: "available" });
  };
}
