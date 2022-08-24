import express, { Request, Response } from "express";
import morganLogger from "morgan";
import crypto from "crypto";
import { createClient as createRedisClient } from "redis";

export const PORT = 3001;
export const HOST = "localhost";

const app = express();
const cache = createRedisClient({ url: "redis://localhost:6379" });

app.use(morganLogger("combined"));

export function healthHandler(req: Request, res: Response) {
  res.send({ status: "available" });
}

app.get("/health", healthHandler);

app.post("/shorten/:longUrl", (req: Request, res: Response) => {
  const longUrl = req.params.longUrl;
  // const shortenedPath = crypto.randomBytes();
  // TODO
  // 1. Generate N random bytes, into base 64 string, S
  // 2. While S is already found in the cache:
  //   1. Generate ++N random bytes, into base 64 string S
  // 3. Return http://host:port/${S} as redirect URL
});

export const server = app.listen(PORT, () => {
  console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
});
