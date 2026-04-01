"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LoadingContextType {
  hasLoadedOnce: boolean;
  setHasLoadedOnce: (val: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  return (
    <LoadingContext.Provider value={{ hasLoadedOnce, setHasLoadedOnce }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
