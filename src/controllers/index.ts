import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { inngest } from "../services/inngest";

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
});

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { toQueue, jobDuration, cpuUsage, concurrencyLimit, steps } =
      requestSchema.parse(req.body);

    await Promise.all(
      Array.from({ length: toQueue }, () => {
        inngest.send({
          name: `inngest-overload-${concurrencyLimit}`,
          data: {
            jobDuration,
            cpuUsage,
            steps,
          },
        });
      })
    );

    const requestData = { toQueue, jobDuration, cpuUsage, concurrencyLimit, steps };
    res.json({ 
      message: `${toQueue} events sent`, 
      sentData: requestData,
      response: { jobDuration, cpuUsage }
    });
  } catch (err) {
    return next(err);
  }
};
