const { scheduleJob } = require("../queue/schedule-store");

exports.scheduleAt = async (req, res) => {
  try {
    const { userId, type, metadata, timestamp } = req.body;

    await scheduleJob(timestamp, { toUserId: userId, type, metadata });

    res.json({ message: "Notification scheduled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to schedule notification" });
  }
};

exports.scheduleAfter = async (req, res) => {
  try {
    const { userId, type, metadata, delaySeconds } = req.body;

    const delaySecondsValue =
      Number(delaySeconds ?? req.body.delay);

    if (!Number.isFinite(delaySecondsValue)) {
      return res.status(400).json({
        error: "delaySeconds (or delay) must be a number"
      });
    }

    const timestamp = Date.now() + delaySecondsValue * 1000;

    await scheduleJob(timestamp, { toUserId: userId, type, metadata });

    res.json({ message: "Scheduled after delay" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Schedule failed" });
  }
};

exports.scheduleDaily = async (req, res) => {
  try {
    const { userId, type, metadata, hour, minute } = req.body;

    const now = new Date();
    const next = new Date(now);

    next.setHours(hour);
    next.setMinutes(minute);
    next.setSeconds(0);

    if (next <= now) next.setDate(next.getDate() + 1);

    await scheduleJob(next.getTime(), {
      toUserId: userId,
      type,
      metadata,
      repeat: "daily"
    });

    res.json({ message: "Daily schedule set" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Daily schedule failed" });
  }
};
