import express from "express";
import { createClient as createRedisClient } from "redis";

export interface Route {
  path: string;
  handler: (
    cache: ReturnType<typeof createRedisClient>
  ) => express.RequestHandler;
  method: "post" | "get";
}

export type RedisClient = ReturnType<typeof createRedisClient>;
