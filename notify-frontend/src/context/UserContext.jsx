import React, { createContext, useState } from "react";

 const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(1);
  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
