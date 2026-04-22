import { type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/use-color-scheme";

const LIGHT_GRADIENT = ["#E0DFE8", "#D8D7E2", "#E0DFE8"] as const;
const DARK_GRADIENT = ["#1c1c21", "#212127", "#1d1d22"] as const;

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
