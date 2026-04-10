import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Styling } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.tint },
    secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
    secondaryFill1: { backgroundColor: colors.bgLayer1 },
    secondaryFill2: { backgroundColor: colors.bgLayer2 },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        { opacity: pressed ? 0.85 : isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : colors.tint} />
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
    borderRadius: Styling.borderRadius,
  },
});
