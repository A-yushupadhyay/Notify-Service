const redis = require("../cache/redis");
const { pushToQueue } = require("../queue/redis-stream");
const { pushToDLQ } = require("../queue/dlq-stream");

const RETRY_KEY_PREFIX = "retry:";

// Exponential backoff schedule (in seconds)
const BACKOFF = [1, 5, 15, 30, 60];
const MAX_RETRIES = BACKOFF.length;

async function handleRetry(eventId, eventData) {
  const key = RETRY_KEY_PREFIX + eventId;

  let attempts = await redis.get(key);
  attempts = attempts ? parseInt(attempts) : 0;

  if (attempts >= MAX_RETRIES) {
    console.log("⚠️  Moving event to DLQ:", eventId);
    await pushToDLQ(eventData);
    await redis.del(key);
    return;
  }

  const delaySec = BACKOFF[attempts];
  console.log(`🔁 Retry ${attempts + 1}/${MAX_RETRIES} after ${delaySec}s`);

  // Increment retry count
  await redis.set(key, attempts + 1);

  // Requeue after delay
  setTimeout(() => {
    pushToQueue(eventData);
  }, delaySec * 1000);
}

module.exports = { handleRetry };
