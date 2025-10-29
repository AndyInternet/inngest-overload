import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { processEventsInWorker } from "../utils/worker-manager";

const requestSchema = z.object({
  toQueue: z.number(),
  jobDuration: z.number(),
  cpuUsage: z.enum(["light", "heavy"]),
  concurrencyLimit: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(10),
    z.literal(25),
    z.literal(50),
  ]),
  steps: z.boolean(),
  duration: z.number().default(0),
  failureRate: z.number().min(0).max(1).default(0),
});

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { toQueue, jobDuration, cpuUsage, concurrencyLimit, steps, duration, failureRate } =
      requestSchema.parse(req.body);

    await processEventsInWorker({
      toQueue,
      jobDuration,
      cpuUsage,
      concurrencyLimit,
      steps,
      duration,
      failureRate,
    });

    const requestData = { toQueue, jobDuration, cpuUsage, concurrencyLimit, steps, duration, failureRate };
    res.json({
      message: `${toQueue} events sent`,
      sentData: requestData,
      response: { jobDuration, cpuUsage, failureRate }
    });
  } catch (err) {
    return next(err);
  }
};
