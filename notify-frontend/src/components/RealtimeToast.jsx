import React, { useEffect, useState } from "react";

export default function RealtimeToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function handler(e) {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    }

    window.addEventListener("notify_toast", handler);
    return () => window.removeEventListener("notify_toast", handler);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded shadow-lg z-50">
      {toast.metadata?.message || toast.type}
    </div>
  );
}
