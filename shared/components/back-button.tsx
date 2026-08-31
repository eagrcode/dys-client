import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { router } from "expo-router";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Icon } from "./icon";

type Props = {
  type: "down" | "left" | "close";
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({ type, size = 22, style }: Props) {
  const theme = useCurrentTheme();

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={7}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Icon
        name={type === "down" ? "caret-down" : type === "left" ? "caret-left" : "x"}
        size={size}
        color={theme.colors.icon}
        weight="bold"
      />
    </Pressable>
  );
}
