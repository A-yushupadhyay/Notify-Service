import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
let socket = null;

export function initSocket(userId, onNotification) {
  try {
    socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    socket.on("notification", (payload) => {
      if (onNotification) onNotification(payload);
    });
  } catch (err) {
    console.error("Socket init error:", err);
  }
  return socket;
}

export function closeSocket() {
  socket && socket.disconnect();
}
