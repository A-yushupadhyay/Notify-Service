const router = require("express").Router();
const bulkController = require("./bulk.controller");

// For sending bulk notifications
router.post("/", bulkController.sendBulk);

module.exports = router;
