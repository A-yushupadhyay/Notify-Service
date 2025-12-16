const redis = require("../cache/redis");
const { NOTIFICATION_STREAM } = require("./topics");

async function pushToQueue(event) {
  await redis.xadd(NOTIFICATION_STREAM, "*", "data", JSON.stringify(event));
}

// Consumer group setup
async function createConsumerGroup() {
  try {
    await redis.xgroup("CREATE", NOTIFICATION_STREAM, "notify_group", 0);
  } catch (error) {
    console.log("Consumer group already exists");
  }
}

async function readFromQueue(consumerName) {
  const response = await redis.xreadgroup(
    "GROUP", "notify_group", consumerName,
    "COUNT", 10,
    "BLOCK", 2000,
    "STREAMS", NOTIFICATION_STREAM, ">"
  );

  return response;
}

module.exports = {
  pushToQueue,
  createConsumerGroup,
  readFromQueue
};
