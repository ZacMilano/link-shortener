import express, { Request, Response } from "express";
import morganLogger from "morgan";
import crypto from "crypto";
import { createClient as createRedisClient } from "redis";

export const PORT = 3001;
export const HOST = "localhost";

const app = express();
const cache = createRedisClient({ url: "redis://localhost:6379" });

app.use(morganLogger("combined"));

function isValidShortPath(path: string) {
  return !["health", "shorten"].includes(path);
}

export function healthHandler(req: Request, res: Response) {
  res.send({ status: "available" });
}

app.get("/health", healthHandler);

app.post("/shorten/:longUrl", async (req: Request, res: Response) => {
  const longUrl = req.params.longUrl;
  let bytesLength = 8;
  let shortenedPath = crypto.randomBytes(bytesLength).toString("base64url");
  let cacheCheck = await cache.get(shortenedPath);

  while (cacheCheck !== null && isValidShortPath(shortenedPath)) {
    shortenedPath = crypto.randomBytes(++bytesLength).toString("base64url");
    cacheCheck = await cache.get(shortenedPath);
  }

  // TODO
  // 3. Put S --> L (long URL) in cache
  // 4. Return http://host:port/${S} as redirect URL
});

export const server = app.listen(PORT, () => {
  console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
});
