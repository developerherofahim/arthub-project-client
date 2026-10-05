'use client';

import React, { createContext, useContext, useState, useCallback } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    // Provide a safe fallback object so calling without provider doesn't break
    return {
      isOpen: false,
      setIsOpen: () => {},
      open: () => {},
      close: () => {},
      toggle: () => {},
    };
  }
  return context;
}