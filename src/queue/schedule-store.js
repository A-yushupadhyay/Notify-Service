// src/queue/schedule-store.js
const redis = require("../cache/redis");

const SCHEDULE_KEY = "scheduled_zset";

// Add job
async function scheduleJob(timestamp, payload) {
  if (!payload || !payload.toUserId) {
    throw new Error("Scheduled job must include toUserId");
  }

  await redis.zadd(SCHEDULE_KEY, timestamp, JSON.stringify(payload));
}

// Fetch due jobs
async function getDueJobs(now) {
  return redis.zrangebyscore(SCHEDULE_KEY, 0, now);
}

// Remove processed job
async function removeJob(rawPayload) {
  await redis.zrem(SCHEDULE_KEY, rawPayload);
}

module.exports = {
  SCHEDULE_KEY,
  scheduleJob,
  getDueJobs,
  removeJob
};
