import { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { RedisClient, Route } from "../types";

export const shortenRoute: Route = {
  path: "/shorten",
  method: "post",
  middlewares: [bodyParser.json()],
  handler: shortenHandler,
};

function isValidShortPath(path: string) {
  return !["health", "shorten"].includes(path);
}

function shortenHandler(cache: RedisClient) {
  return async function (req: Request, res: Response) {
    let bytesLength = 1;
    let shortenedPath = crypto.randomBytes(bytesLength).toString("base64url");
    let cacheCheck = await cache.get(shortenedPath);

    while (cacheCheck !== null && isValidShortPath(shortenedPath)) {
      console.log("Cache hit! Oops!");
      shortenedPath = crypto.randomBytes(++bytesLength).toString("base64url");
      cacheCheck = await cache.get(shortenedPath);
    }

    let longUrl = req.body.longUrl;
    if (!longUrl.startsWith("http")) {
      longUrl = `http://${longUrl}`;
    }
    await cache.set(shortenedPath, longUrl);

    const shortenedUrl = `http://localhost:3001/${shortenedPath}`;

    res.status(201).send({
      shortenedUrl,
      originalLength: req.body.longUrl.length,
      shortenedLength: shortenedUrl.length,
    });
  };
}
