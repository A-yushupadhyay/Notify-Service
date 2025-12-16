import { createContext, useState } from "react";

const LiveEventContext = createContext(null);

export function LiveEventProvider({ children }) {
  const [event, setEvent] = useState(null);

  return (
    <LiveEventContext.Provider value={{ event, setEvent }}>
      {children}
    </LiveEventContext.Provider>
  );
}

export { LiveEventContext };
