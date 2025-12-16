import React from "react";

export default function NotificationItem({ item }) {
  const ts = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "";
  return (
    <div
      className={`p-3 hover:bg-gray-50 border-b dark:hover:bg-gray-700 ${
        item.isRead ? "opacity-80" : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-sm text-gray-800 dark:text-gray-100">
            {item.metadata?.message || `${item.type}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ts}</div>
        </div>
      </div>
    </div>
  );
}
