import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { createClient as createRedisClient } from "redis";
import crypto from "crypto";

export function addRoutes(
  app: express.Express,
  cache: ReturnType<typeof createRedisClient>
) {
  function isValidShortPath(path: string) {
    return !["health", "shorten"].includes(path);
  }

  function healthHandler(req: Request, res: Response) {
    res.send({ status: "available" });
  }

  app.get("/health", healthHandler);

  app.post(
    "/shorten",
    bodyParser.json(),
    async (req: Request, res: Response) => {
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
    }
  );

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
