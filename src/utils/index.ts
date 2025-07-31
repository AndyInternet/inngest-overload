import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const lightDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const heavyDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const endTime = performance.now() + ms;
    while (performance.now() < endTime) {
      bcrypt.hashSync(randomUUID(), 10);
    }
    resolve();
  });

export const delay = (
  delayInMS: number,
  cpuUsage: "light" | "heavy" = "light"
): Promise<void> => {
  return cpuUsage === "light" ? lightDelay(delayInMS) : heavyDelay(delayInMS);
};
