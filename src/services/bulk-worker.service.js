const { readBulkJob } = require("../queue/bulk-stream");
const { pushToQueue } = require("../queue/redis-stream");

const CHUNK_SIZE = 500;

async function startBulkWorker() {
  console.log("🚀 Bulk Worker Started...");

  while (true) {
    const entries = await readBulkJob("bulk_consumer");

    if (!entries) continue;
    const [_, records] = entries[0];

    for (let [id, fields] of records) {
      const job = JSON.parse(fields[1]);
      const { userIds, type, metadata } = job;

      console.log(`📦 Bulk job received (${userIds.length} users)`);

      // Break into chunks of 500
      for (let i = 0; i < userIds.length; i += CHUNK_SIZE) {
        const chunk = userIds.slice(i, i + CHUNK_SIZE);

        // Push chunk of events
        chunk.forEach(userId => {
          const event = {
            to_user_id: userId,
            type,
            metadata
          };

          pushToQueue(event);
        });

        console.log(`➡️ Processed chunk of ${chunk.length}`);
      }
    }
  }
}

module.exports = startBulkWorker;
