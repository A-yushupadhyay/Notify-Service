const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // user joins personal room
    socket.on("register", (userId) => {
      socket.join(`user_${userId}`);
    });
  });
}

module.exports = (server) => initSocket(server);
module.exports.io = {
  to: (...args) => io.to(...args),
  emit: (...args) => io.emit(...args)
};
