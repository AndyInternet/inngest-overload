import { Router } from "express";
import { index } from "../controllers";
import { serve } from "inngest/express";
import { inngest, functions } from "../services/inngest";

const router = Router();

export function setRoutes(app: Router) {
  app.post("/trigger", index);

  app.use(
    "/api/inngest",
    async (req, res, next) => {
      console.log(req.body);
      next();
    },
    serve({ client: inngest, functions })
  );
}

export default router;
