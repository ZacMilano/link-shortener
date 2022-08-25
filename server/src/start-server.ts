import express from "express";
import cors from "cors";
import morganLogger from "morgan";
import redis from "redis";
import { addRoutes } from "./routes/add-routes";

export function startServer(onPort?: number) {
  const PORT = onPort ?? 3001;
  const HOST = "localhost";

  const app = express();
  const cache = redis.createClient({ url: "redis://localhost:6379" });

  app.use(morganLogger("combined"));
  app.use(cors());
  addRoutes(app, cache);

  return app.listen(PORT, () => {
    cache.connect().then(() => console.log("Connected to Redis cache."));
    console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
  });
}
