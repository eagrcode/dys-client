import { useMemo } from "react";
import { Accent, Colors, Fonts, Styling } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useTheme() {
  const scheme = useColorScheme() ?? "light";

  return useMemo(
    () => ({
      scheme,
      colors: { ...Colors[scheme], ...Accent },
      radius: Styling.borderRadius,
      shadow: Styling.shadow,
      fonts: Fonts,
    }),
    [scheme],
  );
}
