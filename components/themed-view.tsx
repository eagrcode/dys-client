import { type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/use-color-scheme";

const LIGHT_GRADIENT = ["#f4f0ec", "#ede9e3", "#f4f0ec"] as const;
const DARK_GRADIENT = ["#02060a", "#0d1218", "#02060a"] as const;

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? LIGHT_GRADIENT : DARK_GRADIENT;

  return (
    <LinearGradient
      colors={[...colors]}
      locations={[0, 0.5, 1]}
      style={[{ flex: 1 }, style]}
      {...otherProps}
    />
  );
}
