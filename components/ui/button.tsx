import { useCurrentTheme } from "@/hooks/use-current-theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "secondaryFill1" | "secondaryFill2";

type ButtonProps = {
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function Button({
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  children,
}: ButtonProps) {
  const theme = useCurrentTheme();

  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {},
    secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: theme.colors.border },
    secondaryFill1: { backgroundColor: theme.colors.bgLayer1 },
    secondaryFill2: { backgroundColor: theme.colors.bgLayer2 },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        {
          opacity: pressed ? 0.85 : isDisabled ? 0.5 : 1,
          borderRadius: theme.radius.md,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {variant === "primary" && (
        <LinearGradient
          colors={theme.colors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#fff" : theme.colors.accent}
        />
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
