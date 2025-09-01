import express from "express";
import type { Express, Request, Response } from "express";
import { MapRouters } from "./router/router.js";


const port = process.env.PORT || 8000;
const app: Express = express();

// app.get("/", (req: Request, res: Response) => {
//     res.send("Hii it's working, made a change");
// });

// app.get("/hi", (req: Request, res: Response) => {
//     res.send("this is hi page");
// });

MapRouters(app);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
