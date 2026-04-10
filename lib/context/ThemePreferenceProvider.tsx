import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

type ColorScheme = "light" | "dark";

type ThemePreferenceContextType = {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextType | undefined>(undefined);

const STORE_KEY = "themePreference";

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [userPreference, setUserPreference] = useState<ColorScheme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(STORE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark") {
        setUserPreference(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const colorScheme: ColorScheme = userPreference ?? systemScheme;

  const toggleTheme = useCallback(() => {
    const next: ColorScheme = colorScheme === "light" ? "dark" : "light";
    setUserPreference(next);
    SecureStore.setItemAsync(STORE_KEY, next);
  }, [colorScheme]);

  if (!isLoaded) return null;

  return (
    <ThemePreferenceContext.Provider value={{ colorScheme, toggleTheme }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = (): ThemePreferenceContextType => {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error("useThemePreference must be used within a ThemePreferenceProvider");
  }
  return context;
};

export function useColorScheme(): ColorScheme {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ThemePreferenceProvider");
  }
  return context.colorScheme;
}
