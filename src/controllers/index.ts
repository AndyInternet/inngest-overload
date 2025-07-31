import { NextFunction, Request, Response } from "express";
import { inngest } from "../services/inngest";

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    toQueue: toQueueStr,
    runDuration: runDurationStr,
    cpuUsage: cpuUsageStr,
    concurrencyLimit: concurrencyLimitStr,
  } = req.body;
  const toQueue = Number(toQueueStr);
  const runDuration = Number(runDurationStr);
  const cpuUsage = String(cpuUsageStr);
  const concurrencyLimit = String(concurrencyLimitStr);

  if (isNaN(toQueue)) {
    next(new Error("number required"));
  }

  if (isNaN(runDuration)) {
    next(new Error("duration required"));
  }

  if (cpuUsage !== "light" && cpuUsage !== "heavy") {
    next(new Error("cpuUsage must be light or heavy"));
  }

  if (
    concurrencyLimit !== "0" &&
    concurrencyLimit !== "1" &&
    concurrencyLimit !== "10"
  ) {
    next(new Error("concurrencyLimit required and must be 0, 1 or 10"));
  }

  try {
    await Promise.all(
      Array.from({ length: toQueue }, () => {
        inngest.send({
          name: `run-${concurrencyLimit}`,
          data: {
            runDuration,
            cpuUsage,
          },
        });
      })
    );
  } catch (err) {
    next(err);
  }
  res.json({ message: `${toQueue} events sent`, runDuration, cpuUsage });
};
