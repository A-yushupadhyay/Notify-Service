import React from "react";
import { useUser } from "../context/useUser";

export default function UserSelector() {
  const { userId, setUserId } = useUser();

  return (
    <select
      className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
      value={userId}
      onChange={(e) => setUserId(Number(e.target.value))}
    >
      <option value={1}>User 1</option>
      <option value={2}>User 2</option>
      <option value={3}>User 3</option>
      <option value={4}>User 4</option>
    </select>
  );
}
