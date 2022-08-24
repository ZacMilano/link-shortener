import { Request, Response } from "express";
import { RedisClient, Route } from "../types";

export const routeToLongUrlRoute: Route = {
  path: "/:shortenedPath",
  method: "get",
  handler: routeToLongUrlHandler,
};

function routeToLongUrlHandler(cache: RedisClient) {
  return async function (req: Request, res: Response) {
    const longUrl = await cache.get(req.params.shortenedPath);

    if (longUrl === null) {
      res.status(404).send();
      return;
    }

    res
      .writeHead(301, {
        Location: longUrl,
      })
      .send();
  };
}
