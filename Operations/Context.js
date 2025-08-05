/**
 * Application Context Provider
 * Manages global state for the quiz application using React Context
 */
import React, { createContext, useState } from "react";

export const AppContext = createContext();

/**
 * Context provider component for sharing global application state
 * Currently manages quiz score state across components
 * @param {Object} children - Child components to wrap with context
 */
export const ContextProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  return (
    <AppContext.Provider value={{ score, setScore }}>
      {children}
    </AppContext.Provider>
  );
};
