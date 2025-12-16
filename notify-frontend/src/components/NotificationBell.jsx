import React, { useEffect, useState } from "react";
import { useUser } from "../context/useUser";
import axios from "axios";
import { initSocket, closeSocket } from "../utils/socket";
import { useLiveEvent } from "../context/useLiveEvent";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function NotificationBell({ onOpen }) {

  const { userId } = useUser();
  const [unread, setUnread] = useState(0);
  const { setEvent } = useLiveEvent();

  useEffect(() => {
    let mounted = true;

    async function fetchUnread() {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/notify/unread/${userId}`
        );
        if (mounted) setUnread(res.data.unread || 0);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUnread();

    const socket = initSocket(userId, (payload) => {
      setUnread((u) => u + 1);
      
      setEvent(payload); // Update live event context

      window.dispatchEvent(
        new CustomEvent("notify_toast", { detail: payload })
      ); // Trigger toast notification
    });
    console.log("WebSocket connected for user:", socket);

    return () => {
      mounted = false;
      closeSocket();
    };
  }, [userId, setEvent]); 

  return (
    <div className="relative">
      <button
        onClick={onOpen}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700 dark:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
          />
        </svg>
      </button>

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </div>
  );
}
