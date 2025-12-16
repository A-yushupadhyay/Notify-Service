import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function SchedulePanel() {
  const { userId } = useUser();
  const [seconds, setSeconds] = useState(10);
  const [message, setMessage] = useState("");

  async function schedule() {
    await axios.post(`${BACKEND_URL}/api/schedule/after`, {
      userId,
      delaySeconds: seconds,
      type: "REMINDER",
      metadata: { message }
    });
    alert("Scheduled!");
    setMessage("");
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Schedule Notification</h3>

      <input
        type="number"
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
        placeholder="Delay in seconds"
      />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
        placeholder="Message"
      />

      <button
        onClick={schedule}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Schedule
      </button>
    </div>
  );
}
