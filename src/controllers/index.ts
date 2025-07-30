import { NextFunction, Request, Response } from "express";
import { inngest } from "../services/inngest";

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { toQueue: toQueueStr, runDuration: runDurationStr } = req.body;
  const toQueue = Number(toQueueStr);
  const runDuration = Number(runDurationStr);

  if (isNaN(toQueue)) {
    next(new Error("number required"));
  }

  if (isNaN(runDuration)) {
    next(new Error("duration required"));
  }

  try {
    await Promise.all(
      Array.from({ length: toQueue }, () => {
        inngest.send({
          name: "run",
          data: {
            runDuration,
          },
        });
      })
    );
  } catch (err) {
    next(err);
  }
  res.json({ message: `${toQueue} ${runDuration}ms events sent` });
};
