import { Inngest } from "inngest";
import { delay } from "../utils";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "inngest-overload" });

const run = inngest.createFunction(
  { id: "run" },
  { event: "run" },
  async ({ event, step }) => {
    const delayTime = event.data.delayTime;
    await delay(delayTime);
    return { message: `function processed` };
  }
);

// Array of registered functions
export const functions = [run];
