import { NextFunction, Request, Response } from "express";
import { inngest } from "../services/inngest";

export const index = (req: Request, res: Response) => {
  res.json({ message: "New app, who dis?" });
};

export const trigger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const toQueue = Number(req.params.number);
  const delayTime = Number(req.params.delayTime);
  if (isNaN(toQueue)) {
    next(new Error("number required"));
  }
  if (isNaN(delayTime)) {
    next(new Error("duration required"));
  }
  try {
    await Promise.all(
      Array.from({ length: toQueue }, () => {
        inngest.send({
          name: "run",
          data: {
            delayTime,
          },
        });
      })
    );
  } catch (err) {
    next(err);
  }
  res.json({ message: `${toQueue} events sent!` });
};
