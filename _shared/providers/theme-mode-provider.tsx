import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ColorScheme = "light" | "dark";

type ThemePreferenceContextType = {
  colorScheme: ColorScheme;
  toggleMode: () => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextType | undefined>(undefined);

const STORE_KEY = "themePreference";

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [userPreference, setUserPreference] = useState<ColorScheme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Device setting, fall back to light if not available
  const systemScheme = useColorScheme() ?? "light";

  // Prioritise user preference, else fall back to system
  const colorScheme = userPreference ?? systemScheme;

  useEffect(() => {
    loadUserPreference();
  }, []);

  // Load user preference from SecureStore on mount
  const loadUserPreference = async () => {
    console.log("ThemeModeProvider | Initialising user theme preference...");
    try {
      const storedPref = await SecureStore.getItemAsync(STORE_KEY);

      if (storedPref === "light" || storedPref === "dark") {
        console.log(`ThemeModeProvider | User preference found, applying setting: ${storedPref}`);
        setUserPreference(storedPref);
      } else {
        console.log(
          `ThemeModeProvider | No preference found, applying system setting: ${systemScheme}`,
        );
      }
    } catch (error) {
      console.error("ThemeModeProvider | Error loading theme", error);
    } finally {
      setIsLoaded(true);
      console.log("ThemeModeProvider | Finished initialising user preference");
    }
  };

  const persistUserPreference = async (mode: ColorScheme) => {
    try {
      await SecureStore.setItemAsync(STORE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme", error);
    }
  };

  const toggleMode = () => {
    const mode: ColorScheme = colorScheme === "light" ? "dark" : "light";

    setUserPreference(mode);
    void persistUserPreference(mode);
  };

  if (!isLoaded) return null;

  return (
    <ThemePreferenceContext.Provider value={{ colorScheme, toggleMode }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};

export function useThemePreference(): ThemePreferenceContextType {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error("useThemePreference must be used within a ThemePreferenceProvider");
  }
  return context;
}
