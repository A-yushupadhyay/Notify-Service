const router = require("express").Router();
const scheduleController = require("./schedule.controller");

// Schedule at exact timestamp
router.post("/at", scheduleController.scheduleAt);

// Schedule after delay (e.g., after 10 mins)
router.post("/after", scheduleController.scheduleAfter);

// Daily recurring schedule
router.post("/daily", scheduleController.scheduleDaily);

module.exports = router;
