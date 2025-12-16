const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function createGroup(stream, group) {
  try {
    await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM");
    console.log(`✔ Stream '${stream}' + Group '${group}' created!`);
  } catch (err) {
    if (err?.message?.includes("BUSYGROUP")) {
      console.log(`✔ Group '${group}' already exists.`);
    } else {
      console.error(`❌ Error creating group '${group}' on stream '${stream}':`, err);
    }
  }
}

async function init() {
  console.log("🔧 Initializing Redis Streams & Consumer Groups...\n");

  // MAIN notifications stream
  await createGroup("notifications_stream", "notify_group");

  // BULK notification stream
  await createGroup("bulk_notifications", "bulk_group");

  // DEAD LETTER QUEUE stream
  await createGroup("dlq_stream", "dlq_group");

  // SCHEDULED NOTIFICATIONS stream
  // SCHEDULED notifications STREAM (NOT ZSET)
  await createGroup("scheduled_stream", "schedule_group");


  console.log("\n✨ All Redis streams initialized successfully!");
  process.exit(0);
}

init();
