const redis = require("../cache/redis");

const BULK_STREAM = "bulk_notifications";

async function pushBulkJob(job) {
  await redis.xadd(BULK_STREAM, "*", "data", JSON.stringify(job));
}

async function readBulkJob(consumer) {
  return await redis.xreadgroup(
    "GROUP", "bulk_group", consumer,
    "COUNT", 1,
    "BLOCK", 2000,
    "STREAMS", BULK_STREAM, ">"
  );
}

async function createBulkGroup() {
  try {
    await redis.xgroup("CREATE", BULK_STREAM, "bulk_group", 0);
  } catch (e) {}
}

module.exports = {
  BULK_STREAM,
  pushBulkJob,
  readBulkJob,
  createBulkGroup
};
