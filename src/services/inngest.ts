import { Inngest } from "inngest";
import { delay } from "../utils";
import { cpuUsage } from "process";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "inngest-overload" });

const createRunFunction = (concurrencyLimit: number) =>
  inngest.createFunction(
    {
      id: `run-${concurrencyLimit}`,
      concurrency: {
        limit: concurrencyLimit,
      },
    },
    { event: `run-${concurrencyLimit}` },
    async ({ event }) => {
      const runDuration = event.data.runDuration;
      const cpuUsage = event.data.cpuUsage;
      await delay(runDuration, cpuUsage);
      return { message: `function processed` };
    }
  );

const runAll = createRunFunction(0);
const run1 = createRunFunction(1);
const run10 = createRunFunction(10);

// Array of registered functions
export const functions = [run1, run10, runAll];
