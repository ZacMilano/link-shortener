import express, { Request, Response } from "express";
import { healthRoute } from "./health";
import { Route, RedisClient } from "../types";
import { shortenRoute } from "./shorten";

export function addRoutes(app: express.Express, cache: RedisClient) {
  const routes: Route[] = [healthRoute, shortenRoute];

  for (const route of routes) {
    app[route.method](
      route.path,
      ...(route.middlewares || []),
      route.handler(cache)
    );
  }

  app.get("/:shortenedPath", async (req: Request, res: Response) => {
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
  });
}
