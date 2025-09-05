import express from "express";
import type { Express, Request, Response } from "express";
import { MapRouters } from "./router/router.js";


const port = process.env.PORT || 8000;
const app: Express = express();

MapRouters(app);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
  console.log(`click to open: http://localhost:${port}`);
});
