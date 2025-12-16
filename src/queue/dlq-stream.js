const redis = require("../cache/redis");

const DLQ_STREAM = "notifications_dlq";

async function pushToDLQ(event) {
  await redis.xadd(DLQ_STREAM, "*", "data", JSON.stringify(event));
}

module.exports = { pushToDLQ, DLQ_STREAM };
