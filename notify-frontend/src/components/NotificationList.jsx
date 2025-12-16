import React, { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function NotificationList({ userId }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // to trigger reload (optional)

  useEffect(() => {
    // Reset when user changes
    setItems([]);
    setPage(1);
    setHasMore(true);
    setRefreshKey((k) => k + 1);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/notify/${userId}?page=${page}&limit=${limit}`
        );
        const data = res.data?.data || res.data || [];
        if (!cancelled) {
          if (page === 1) {
            setItems(data);
          } else {
            setItems((prev) => [...prev, ...data]);
          }
          if (data.length < limit) setHasMore(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, userId, refreshKey]);

  return (
    <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-100">Recent</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{items.length} shown</div>
        </div>
      </div>

      <div style={{ maxHeight: "56vh", overflow: "auto" }}>
        {items.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">No notifications</div>
        )}

        {items.map((n) => (
          <NotificationItem key={n.id} item={n} />
        ))}

        {loading && <div className="p-4 text-center text-gray-500">Loading...</div>}

        {!loading && hasMore && (
          <div className="p-4 text-center">
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded"
              onClick={() => setPage((p) => p + 1)}
            >
              Load more
            </button>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No more notifications</div>
        )}
      </div>
    </div>
  );
}
