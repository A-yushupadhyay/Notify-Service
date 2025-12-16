const { pushBulkJob } = require("../queue/bulk-stream");

exports.sendBulk = async (req, res) => {
  try {
    const { userIds, type, metadata } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: "userIds array required" });
    }

    const job = {
      userIds,
      type,
      metadata
    };

    await pushBulkJob(job);

    res.json({ message: "Bulk job queued", count: userIds.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk notification failed" });
  }
};
