import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function EventSimulator() {
  
  const { userId } = useUser();
  const [message, setMessage] = useState("");

  async function sendTest() {
    if (!message.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/api/notify`, {
        toUserId: userId,
        type: "TEST",
        metadata: { message }
      });
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Send Test Notification</h3>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-gray-100"
      />

      <button
        onClick={sendTest}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
