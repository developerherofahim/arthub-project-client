"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { useSyncExternalStore } from "react";

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="arthub_theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot
  );
  const isDark = resolvedTheme === "dark";

  return {
    mounted,
    isDark,
    toggleTheme: () => setTheme(isDark ? "light" : "dark"),
  };
}
