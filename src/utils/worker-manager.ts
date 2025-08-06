import * as workerpool from "workerpool";
import path from "path";

interface EventData {
  toQueue: number;
  jobDuration: number;
  cpuUsage: string;
  concurrencyLimit: number;
  steps: boolean;
  duration?: number;
}

// Create a worker pool
const projectRoot = path.resolve(
  __dirname,
  __dirname.includes("/dist/") ? "../.." : "../../"
);
const workerPath = path.join(projectRoot, "dist/workers/inngest-worker.js");

const pool = workerpool.pool(workerPath, {
  minWorkers: 1,
  maxWorkers: 16,
  workerType: "thread",
});

export async function processEventsInWorker(
  data: EventData
): Promise<{ success: boolean; eventsProcessed: number }> {
  try {
    const result = await pool.exec("processEvents", [data]);
    return result;
  } catch (error) {
    throw new Error(
      `Worker execution failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Cleanup function to terminate the pool
export function terminateWorkerPool(): Promise<void> {
  return pool.terminate();
}
