import { Colors, Fonts, Styling } from "@/constants/theme";
import { useThemePreference } from "@/lib/context/ThemeModeProvider";
import { useMemo } from "react";

export function useCurrentTheme() {
  const { colorScheme } = useThemePreference();

  return useMemo(
    () => ({
      scheme: colorScheme,
      colors: { ...Colors[colorScheme] },
      radius: Styling.borderRadius,
      shadow: Styling.shadow,
      fonts: Fonts,
    }),
    [colorScheme],
  );
}
