import { Colors, Fonts, Styling } from "@/shared/theme/theme";
import { useThemePreference } from "@/shared/providers/theme-mode-provider";
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
