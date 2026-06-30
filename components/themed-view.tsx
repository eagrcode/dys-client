import { type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCurrentTheme } from "@/hooks/use-current-theme";

type ThemedViewProps = ViewProps & {
  variant?: "default" | "home";
};

export function ThemedView({ style, variant = "default", ...otherProps }: ThemedViewProps) {
  const theme = useCurrentTheme();

  const colors = variant === "home" ? theme.colors.homeGradient : theme.colors.screenGradient;

  return (
    <LinearGradient
      colors={[...colors]}
      locations={[0, 0.5, 1]}
      style={[{ flex: 1 }, style]}
      {...otherProps}
    />
  );
}
