import { Express } from "express";
import { Route, RedisClient } from "../types";

export function addRoutes(app: Express, cache: RedisClient, routes: Route[]) {
  for (const route of routes) {
    app[route.method](
      route.path,
      ...(route.middlewares || []),
      route.handler(cache)
    );
  }
}
