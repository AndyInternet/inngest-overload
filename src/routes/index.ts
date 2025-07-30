import { Router } from "express";
import { index, trigger } from "../controllers";
import { serve } from "inngest/express";
import { inngest, functions } from "../services/inngest";

const router = Router();

export function setRoutes(app: Router) {
  app.get("/", index);
  app.get("/trigger/:number/:delayTime", trigger);

  app.use("/api/inngest", serve({ client: inngest, functions }));
}

export default router;
