const redis = require("../cache/redis");
const prisma = require("./prisma");

exports.saveNotification = async (event) => {
  console.log("Saving notification event:", event);

  // 🔒 Normalize event (important for schedulers & workers)
  const toUserId = event.toUserId ?? event.to_user_id;

  if (!toUserId) {
    throw new Error("Invalid event: toUserId is missing");
  }

  const notification = await prisma.notification.create({
    data: {
      toUserId: toUserId,
      fromUserId: event.fromUserId ?? event.from_user_id ?? null,
      type: event.type,
      metadata: event.metadata || {}
    }
  });

  // ✅ Correct Redis key
  await redis.incr(`unread:${toUserId}`);

  return notification;
};

// Pagination version (KEEP ONLY ONE)
exports.getNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  return prisma.notification.findMany({
    where: { toUserId: Number(userId) },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit
  });
};

exports.getUnreadCount = async (userId) => {
  const count = await redis.get(`unread:${userId}`);
  return Number(count) || 0;
};

exports.markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { toUserId: Number(userId), isRead: false },
    data: { isRead: true }
  });

  await redis.set(`unread:${userId}`, 0);
  return true;
};
