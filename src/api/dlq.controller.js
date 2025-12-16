const redis = require("../cache/redis");
const { DLQ_STREAM } = require("../queue/dlq-stream");
const { pushToQueue } = require("../queue/redis-stream");

exports.getDLQItems = async (req, res) => {
  try {
    // Read last 100 DLQ messages
    const entries = await redis.xrevrange(DLQ_STREAM, "+", "-", "COUNT", 100);

    const items = entries.map(([id, fields]) => ({
      id,
      event: JSON.parse(fields[1])
    }));

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch DLQ events" });
  }
};

exports.retryDLQItem = async (req, res) => {
  const eventId = req.params.id;

  try {
    const entry = await redis.xrange(DLQ_STREAM, eventId, eventId);

    if (!entry.length) {
      return res.status(404).json({ error: "DLQ event not found" });
    }

    const event = JSON.parse(entry[0][1][1]);

    // requeue event to normal stream
    await pushToQueue(event);

    res.json({ message: "Event requeued", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Retry failed" });
  }
};

exports.deleteDLQItem = async (req, res) => {
  const eventId = req.params.id;

  try {
    await redis.xdel(DLQ_STREAM, eventId);
    res.json({ message: "DLQ event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};
