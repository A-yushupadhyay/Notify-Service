// scheduler.js
require("dotenv").config();

const redis = require("./src/cache/redis");
const {
  getDueJobs,
  removeJob
} = require("./src/queue/schedule-store");

const STREAM_KEY = "notify_stream";

async function startScheduler() {
  console.log("⏳ Scheduler Worker Started...");

  while (true) {
    try {
      const now = Date.now();
      const jobs = await getDueJobs(now);

      for (const raw of jobs) {
        const event = JSON.parse(raw);

        if (!event.toUserId) {
          console.error("❌ Scheduled event missing toUserId:", event);
          await removeJob(raw);
          continue;
        }

        await redis.xadd(
          STREAM_KEY,
          "*",
          "data",
          JSON.stringify(event)
        );

        console.log("📨 Scheduled notification published:", event);

        await removeJob(raw);
      }
    } catch (err) {
      console.error("Scheduler loop error:", err);
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

startScheduler().catch(err => {
  console.error("Scheduler failed", err);
  process.exit(1);
});
