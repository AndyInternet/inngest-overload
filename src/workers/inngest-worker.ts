import * as workerpool from 'workerpool';
import 'dotenv/config';
import { inngest } from '../services/inngest';

interface WorkerData {
  toQueue: number;
  jobDuration: number;
  cpuUsage: string;
  concurrencyLimit: number;
  steps: boolean;
  duration?: number;
  failureRate?: number;
}

async function processEvents(data: WorkerData) {
  const { toQueue, jobDuration, cpuUsage, concurrencyLimit, steps, duration = 0, failureRate = 0 } = data;

  if (duration === 0) {
    // Send all events immediately
    await Promise.all(
      Array.from({ length: toQueue }, () => {
        return inngest.send({
          name: `inngest-overload-${concurrencyLimit}`,
          data: {
            jobDuration,
            cpuUsage,
            steps,
            failureRate,
          },
        });
      })
    );
  } else {
    // Spread events over the specified duration
    const intervalMs = (duration * 1000) / toQueue;

    for (let i = 0; i < toQueue; i++) {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }

      await inngest.send({
        name: `inngest-overload-${concurrencyLimit}`,
        data: {
          jobDuration,
          cpuUsage,
          steps,
          failureRate,
        },
      });
    }
  }

  return { success: true, eventsProcessed: toQueue };
}

// Create a worker and register our methods
workerpool.worker({
  processEvents: processEvents
});