require("dotenv").config();
const app = require("./app");
const initSocket = require("./websocket/socket");

const startConsumer = require("./services/consumer.service");
startConsumer();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket Server
initSocket(server);
