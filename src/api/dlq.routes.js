const router = require("express").Router();
const dlqController = require("./dlq.controller");

// View DLQ items
router.get("/", dlqController.getDLQItems);

// Retry one DLQ event
router.post("/retry/:id", dlqController.retryDLQItem);

// Delete DLQ item
router.delete("/:id", dlqController.deleteDLQItem);

module.exports = router;
