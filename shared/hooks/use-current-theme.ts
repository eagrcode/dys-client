import {
  Colors,
  controlSize,
  layout,
  radius,
  shadow,
  spacing,
} from "@/shared/theme/theme";
import { useThemePreference } from "@/shared/providers/theme-mode-provider";
import { useMemo } from "react";

export function useCurrentTheme() {
  const { colorScheme } = useThemePreference();

  return useMemo(
    () => ({
      scheme: colorScheme,
      colors: { ...Colors[colorScheme] },
      radius,
      shadow,
      spacing,
      controlSize,
      layout,
    }),
    [colorScheme],
  );
}
