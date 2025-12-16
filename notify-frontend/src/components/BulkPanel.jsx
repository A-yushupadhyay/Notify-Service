import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function BulkPanel() {
  const [message, setMessage] = useState("");

  async function sendBulk() {

    await axios.post(`${BACKEND_URL}/api/bulk`, {
      type: "PROMO",
      metadata: { message }
    });
    alert("Bulk sent!");
    setMessage("");
    
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Bulk Notification</h3>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
        placeholder="Message to all users"
      />

      <button
        onClick={sendBulk}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Send Bulk
      </button>
    </div>
  );
}
