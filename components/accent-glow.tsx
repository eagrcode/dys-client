import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCurrentTheme } from "@/hooks/use-current-theme";

// Drop this inside your Welcome screen, as the first child
export function AccentGlow() {
  const theme = useCurrentTheme();

  // Teal accent at ~18% opacity fading to transparent
  const glowColor =
    theme.scheme === "dark"
      ? "hsla(240, 70%, 70%, 0.3)" // AccentTeal in dark
      : "hsla(240, 92%, 68%, 0.1)"; // softer in light

  return (
    <LinearGradient
      colors={[glowColor, "transparent"]}
      locations={[0, 1]}
      style={StyleSheet.absoluteFillObject}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
      pointerEvents="none"
    />
  );
}
