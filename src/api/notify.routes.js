const router = require("express").Router();
const notifyController = require("./notify.controller");


const rateLimit = require("../middleware/rateLimit");

router.post("/", rateLimit(20, 60), notifyController.createNotification);
router.get("/:userId", notifyController.getNotifications);
router.get("/unread/:userId", notifyController.getUnreadCount);
router.patch("/mark-read", notifyController.markAsRead);




module.exports = router;
