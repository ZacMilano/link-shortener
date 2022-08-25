import { Request, Response } from "express";
import { RedisClient, Route } from "../types";

export const routeToLongUrlRoute: Route = {
  path: "/:shortenedPath",
  method: "get",
  handler: routeToLongUrlHandler,
};

export function routeToLongUrlHandler(cache: RedisClient) {
  return async function (req: Request, res: Response) {
    if (!cache.isOpen) {
      res.status(500);
      res.send();
      return;
    }

    const longUrl = await cache.get(req.params.shortenedPath);

    if (longUrl === null) {
      res.status(404);
      res.send();
      return;
    }

    res.writeHead(301, {
      Location: longUrl,
    });
    res.send();
  };
}
