import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { inngest } from "../services/inngest";

const requestSchema = z.object({
  toQueue: z.number(),
  runDuration: z.number(),
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
    const { toQueue, runDuration, cpuUsage, concurrencyLimit, steps } =
      requestSchema.parse(req.body);

    await Promise.all(
      Array.from({ length: toQueue }, () => {
        inngest.send({
          name: `inngest-overload-${concurrencyLimit}`,
          data: {
            runDuration,
            cpuUsage,
            steps,
          },
        });
      })
    );

    res.json({ message: `${toQueue} events sent`, runDuration, cpuUsage });
  } catch (err) {
    return next(err);
  }
};
