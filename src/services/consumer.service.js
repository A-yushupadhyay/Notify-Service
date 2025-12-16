const notificationService = require("./notification.service");
const { readFromQueue } = require("../queue/redis-stream");
const { handleRetry } = require("./retry.service");
const io = require("../websocket/socket").io;

// 🔹 helper: Redis stream fields → object
function parseStreamFields(fields) {
  const obj = {};
  for (let i = 0; i < fields.length; i += 2) {
    obj[fields[i]] = fields[i + 1];
  }
  return obj;
}

async function startConsumer() {
  console.log("Worker started...");

  while (true) {
    const messages = await readFromQueue("consumer-1");
    if (!messages) continue;

    const [_, entries] = messages[0];

    for (const [id, fields] of entries) {
      // ✅ Convert Redis stream fields properly
      const parsed = parseStreamFields(fields);

      // ✅ Parse payload safely
      const eventData =
        typeof parsed.data === "string"
          ? JSON.parse(parsed.data)
          : parsed;

      console.log("📥 Consumer received event:", eventData);

      try {
        const saved = await notificationService.saveNotification(eventData);

        // ✅ Emit realtime event
        io.to(`user_${saved.toUserId}`).emit("notification", saved);

      } catch (err) {
        console.error("❌ Worker failed:", err.message);
        await handleRetry(id, eventData);
      }
    }
  }
}

module.exports = startConsumer;
