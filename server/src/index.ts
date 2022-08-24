import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morganLogger from "morgan";
import crypto from "crypto";
import { createClient as createRedisClient } from "redis";

export const PORT = 3001;
export const HOST = "localhost";

const app = express();
const cache = createRedisClient({ url: "redis://localhost:6379" });

app.use(morganLogger("combined"));
app.use(cors());

function isValidShortPath(path: string) {
  return !["health", "shorten"].includes(path);
}

export function healthHandler(req: Request, res: Response) {
  res.send({ status: "available" });
}

app.get("/health", healthHandler);

app.post("/shorten", bodyParser.json(), async (req: Request, res: Response) => {
  let bytesLength = 8;
  let shortenedPath = crypto.randomBytes(bytesLength).toString("base64url");
  let cacheCheck = await cache.get(shortenedPath);

  while (cacheCheck !== null && isValidShortPath(shortenedPath)) {
    shortenedPath = crypto.randomBytes(++bytesLength).toString("base64url");
    cacheCheck = await cache.get(shortenedPath);
  }

  console.log(req.body);
  let longUrl = req.body.longUrl;
  if (!longUrl.startsWith("http")) {
    longUrl = `http://${longUrl}`;
  }
  await cache.set(shortenedPath, longUrl);

  const shortenedUrl = `http://localhost/${shortenedPath}`;

  res.status(201);
  res.send({
    shortenedUrl,
    originalLength: longUrl.length,
    shortenedLength: shortenedUrl.length,
  });
});

export const server = app.listen(PORT, () => {
  cache.connect().then(() => console.log("Connected to Redis cache."));
  console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
});
