import { Request, Response } from "express";
import { RedisClient, Route } from "../types";

export const healthRoute: Route = {
  path: "/health",
  method: "get",
  handler: healthHandler,
};

function healthHandler(cache: RedisClient) {
  return function (req: Request, res: Response) {
    res.send({ status: "available" });
  };
}
