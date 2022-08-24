import express from "express";
import morganLogger from "morgan";

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(morganLogger("combined"));

app.get("/health", (req, res) => {
  res.send({ status: "available" });
});

app.listen(PORT, () => {
  console.log(`Link Shortening server listening at http://${HOST}:${PORT}`);
});
