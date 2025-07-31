import { Router } from "express";
import { index } from "../controllers";
import { serve } from "inngest/express";
import { inngest, functions } from "../services/inngest";

const router = Router();

export function setRoutes(app: Router) {
  app.post("/trigger", index);

  app.use("/api/inngest", serve({ client: inngest, functions }));
}

export default router;
