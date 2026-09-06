import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { LinearGradient } from "expo-linear-gradient";
import { radius } from "@/shared/theme/theme";
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
  const { colors } = useCurrentTheme();

  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {},
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    secondaryFill1: { backgroundColor: colors.background.layer1 },
    secondaryFill2: { backgroundColor: colors.background.layer2 },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        {
          opacity: pressed ? 0.8 : isDisabled ? 0.7 : 1,
          borderRadius: radius.md,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {variant === "primary" && (
        <LinearGradient
          colors={colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.text.onAccent : colors.accent.primary}
        />
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
