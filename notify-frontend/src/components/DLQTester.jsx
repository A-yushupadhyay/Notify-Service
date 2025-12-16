import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function DLQTester() {

  async function breakWorker() {
    await axios.post(`${BACKEND_URL}/api/notify`, {
      type: "BROKEN_EVENT" 
    });
    
    alert("Sent broken event (check DLQ)");
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-semibold mb-2 text-red-500">DLQ Test</h3>
      <button
        onClick={breakWorker}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Send Broken Event
      </button>
    </div>
  );
}
