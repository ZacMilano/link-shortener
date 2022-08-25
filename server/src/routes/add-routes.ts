import { Express } from "express";
import { Route, RedisClient } from "../types";
import { healthRoute } from "./health";
import { routeToLongUrlRoute } from "./route-to-long-url";
import { shortenRoute } from "./shorten";

export function addRoutes(app: Express, cache: RedisClient) {
  const routes: Route[] = [healthRoute, routeToLongUrlRoute, shortenRoute];

  for (const route of routes) {
    app[route.method](
      route.path,
      ...(route.middlewares || []),
      route.handler(cache)
    );
  }
}
