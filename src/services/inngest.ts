import { Inngest } from "inngest";
import { delay } from "../utils";

type Data = {
  runDuration: number;
  cpuUsage: "light" | "heavy";
  steps: boolean;
};

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
    async ({ event, step }) => {
      const { runDuration, cpuUsage, steps } = event.data as Data;

      await delay(runDuration, cpuUsage);

      console.log(event.data);

      if (event.data.steps) {
        await step.run("step-1", async () => delay(runDuration, cpuUsage));
        await step.run("step-2", async () => delay(runDuration, cpuUsage));
        await step.run("step-3", async () => delay(runDuration, cpuUsage));
      }

      return { message: `function processed` };
    }
  );

const runAll = createRunFunction(0);
const run1 = createRunFunction(1);
const run10 = createRunFunction(10);
const run25 = createRunFunction(25);
const run50 = createRunFunction(50);

// Array of registered functions
export const functions = [run1, run10, run25, run50, runAll];
