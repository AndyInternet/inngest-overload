import { Inngest } from "inngest";
import { delay } from "../utils";

type Data = {
  jobDuration: number;
  cpuUsage: "light" | "heavy";
  steps: boolean;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "inngest-overload",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

const createIOFunction = (concurrencyLimit: number) =>
  inngest.createFunction(
    {
      id: `inngest-overload-${concurrencyLimit}`,
      concurrency: {
        limit: concurrencyLimit,
      },
    },
    { event: `inngest-overload-${concurrencyLimit}` },
    async ({ event, step }) => {
      const { jobDuration, cpuUsage, steps } = event.data as Data;

      console.log(event);

      await delay(jobDuration, cpuUsage);

      if (event.data.steps) {
        await step.run("inngest-overload-step-1", async () =>
          delay(jobDuration, cpuUsage)
        );
        await step.run("inngest-overload-step-2", async () =>
          delay(jobDuration, cpuUsage)
        );
        await step.run("inngest-overload-step-3", async () =>
          delay(jobDuration, cpuUsage)
        );
      }

      return { message: `function processed` };
    }
  );

const runAll = createIOFunction(0);
const run1 = createIOFunction(1);
const run10 = createIOFunction(10);
const run25 = createIOFunction(25);
const run50 = createIOFunction(50);

// Array of registered functions
export const functions = [run1, run10, run25, run50, runAll];
