const { pushToQueue } = require("../queue/redis-stream");
const notificationService = require("../services/notification.service");

exports.createNotification = async (req, res) => {
  try {
    const event = req.body;
    
    // Push event into queue
    await pushToQueue(event);

    res.status(200).json({ message: "Notification queued" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = req.query.filter;

    const notifications = await notificationService.getNotifications(userId, page, limit, filter);

    res.json({
      page,
      limit,
      data: notifications
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const count = await notificationService.getUnreadCount(userId);

    res.json({ unread: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    await notificationService.markAllAsRead(userId);

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


