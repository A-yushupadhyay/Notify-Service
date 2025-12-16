import React, { useState } from "react";
import NotificationBell from "./components/NotificationBell";
import NotificationList from "./components/NotificationList";
import EventSimulator from "./components/EventSimulator";
import UserSelector from "./components/UserSelector";
import RealtimeToast from "./components/RealtimeToast";
import SchedulePanel from "./components/SchedulePanel";
import BulkPanel from "./components/BulkPanel";
import DLQTester from "./components/DLQTester";
import { useUser } from "./context/useUser";
import { useLiveEvent } from "./context/useLiveEvent";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const { userId } = useUser();
  const { event } = useLiveEvent();
  const [, setOpen] = useState(false); // fixed

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notify — Demo</h1>
          <div className="flex items-center gap-4">
            <UserSelector />
            <NotificationBell onOpen={() => setOpen((s) => !s)} />
          </div>
        </header>

        {/* Main layout */}
        <main className="grid grid-cols-3 gap-6">
          {/* Left side */}
          <div className="col-span-2">
            <EventSimulator />

            <h2 className="text-lg font-semibold mt-6 mb-2">
              System Simulation Controls
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <SchedulePanel />
              <BulkPanel />
              <DLQTester />
            </div>

            {/* Notification Center */}
            <div>
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Notification Center</h2>

                <button
                  onClick={async () => {
                    try {
                      await axios.patch(
                        `${BACKEND_URL}/api/notify/mark-read`,
                        { userId }
                      );
                      window.location.reload();
                    } catch (e) {
                      alert("Failed to mark as read");
                      console.error(e);
                    }
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <NotificationList userId={userId} />
            </div>
          </div>

          {/* Right side — LIVE PANEL */}
          <aside>
            <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
              <h3 className="font-semibold mb-2">Live Panel</h3>

              {!event && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Waiting for real-time events...
                </p>
              )}

              {event && (
                <div className="text-sm space-y-1">
                  <div>
                    <b>Type:</b> {event.type}
                  </div>
                  <div>
                    <b>Message:</b>{" "}
                    {event.metadata?.message || "—"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>

      <RealtimeToast />
    </div>
  );
}
