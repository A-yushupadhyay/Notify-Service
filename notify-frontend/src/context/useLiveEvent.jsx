import { useContext } from "react";
import { LiveEventContext } from "./LiveEventContect";

export function useLiveEvent() {
  const ctx = useContext(LiveEventContext);
  if (!ctx) {
    throw new Error("useLiveEvent must be used inside LiveEventProvider");
  }
  return ctx;
}
