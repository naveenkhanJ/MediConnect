"use client";

import { doctors } from "@/assets/data";
import { createContext } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const currencySymbol = "$";

  const value = {
    doctors,
    currencySymbol,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;