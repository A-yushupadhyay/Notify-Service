const redis = require("../cache/redis");
const { DLQ_STREAM } = require("../queue/dlq-stream");

async function startDLQConsumer() {
  console.log("DLQ Consumer started...");

  while (true) {
    const entries = await redis.xread(
      "BLOCK", 5000,
      "STREAMS", DLQ_STREAM, "$"
    );

    if (!entries) continue;

    const [_, records] = entries[0];

    for (const [id, fields] of records) {
      const event = JSON.parse(fields[1]);

      console.log("DLQ EVENT:", id, event);
    }
  }
}

module.exports = startDLQConsumer;
