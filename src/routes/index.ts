import { Router } from "express";
import { index } from "../controllers";

const router = Router();

export function setRoutes(app: Router) {
  app.get("/", index);
}

export default router;
