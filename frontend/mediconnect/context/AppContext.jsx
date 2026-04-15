"use client";

import { doctors } from "@/assets/data";
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const currencySymbol = "$";
  const [user, setUser] = useState(null);

  // On app load, read user from localStorage if already logged in
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const value = {
    doctors,
    currencySymbol,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
