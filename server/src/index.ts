import express, { Request, Response } from "express";
import morganLogger from "morgan";

const app = express();
export const PORT = 3000;
export const HOST = "localhost";

app.use(morganLogger("combined"));

export function healthHandler(req: Request, res: Response) {
  res.send({ status: "available" });
}

app.get("/health", healthHandler);

export const server = app.listen(PORT, () => {
  console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
});
