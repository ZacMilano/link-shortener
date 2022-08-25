import { Request, Response } from "express";
import { RedisClient } from "../../types";
import { createClient as createRedisClient } from "redis-mock";
import { routeToLongUrlHandler } from "../route-to-long-url";

describe("/shorten route", () => {
  let cache: RedisClient;
  let handler: ReturnType<typeof routeToLongUrlHandler>;

  beforeEach(() => {
    cache = createRedisClient();
    handler = routeToLongUrlHandler(cache);
  });

  describe("/:shortenedPath handler", () => {
    describe("cache behavior", () => {
      it("only `get`s from the cache once", () => {});

      it("does not `set` in the cache", () => {});
    });

    describe("response", () => {
      it("sends 500 if there's no cache connection", () => {});

      it("sends 404 if the given shortenedPath is not found in the cache", () => {});

      it("sends 301 with the Location header set to the `longUrl` if found in the cache", () => {});
    });
  });
});
