import { RequestHandler } from "express";
import redis from "redis";

export interface Route {
  path: string;
  method: "post" | "get";
  middlewares?: RequestHandler[];
  // Curried closure to give app/cache context
  handler: (cache: RedisClient) => RequestHandler;
}

export type RedisClient = ReturnType<typeof redis.createClient>;
