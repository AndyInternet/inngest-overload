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
  cpuUsage: "light" | "heavy" = "light",
  failureRate: number = 0
): Promise<void> => {
  // Check if this call should fail based on failure rate
  if (failureRate > 0 && Math.random() < failureRate) {
    return Promise.reject(new Error(`Simulated failure (failure rate: ${failureRate * 100}%)`));
  }
  return cpuUsage === "light" ? lightDelay(delayInMS) : heavyDelay(delayInMS);
};
