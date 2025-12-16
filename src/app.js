const express = require("express");
const cors = require("cors");
const notifyRoutes = require("./api/notify.routes");
const dlqRoutes = require("./api/dlq.routes");
const bulkRoutes = require("./api/bulk.routes");
const scheduleRoutes = require("./api/schedule.routes");



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/bulk", bulkRoutes);
app.use("/api/schedule", scheduleRoutes);


app.use("/api/notify", notifyRoutes);
app.use("/api/dlq", dlqRoutes);

module.exports = app;
