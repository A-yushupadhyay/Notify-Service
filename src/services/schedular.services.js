const { getDueJobs, removeJob } = require("../queue/schedule-store");
const { pushToQueue } = require("../queue/redis-stream");

async function startScheduler() {
  console.log("Scheduler Worker Started...");

  setInterval(async () => {
    const now = Date.now();

    // Fetch due jobs
    const jobs = await getDueJobs(now);

    for (const jobString of jobs) {
      const job = JSON.parse(jobString);

      // Create actual notification event
      pushToQueue({
        to_user_id: job.userId,
        type: job.type,
        metadata: job.metadata
      });

      // Remove from schedule
      await removeJob(jobString);

      // Reschedule if daily recurring
      if (job.repeat === "daily") {
        const next = Date.now() + 24 * 60 * 60 * 1000;
        await scheduleJob(next, job);
      }

      console.log("Scheduled notification executed:", job);
    }
  }, 1000); // poll every 1 sec
}

module.exports = startScheduler;
