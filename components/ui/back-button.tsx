import { useCurrentTheme } from "@/hooks/use-current-theme";
import { router } from "expo-router";
import { Pressable, StyleProp, TextStyle, StyleSheet } from "react-native";
import { IconSymbol } from "./icon-symbol";

type Props = {
  type: "down" | "left" | "close";
  size?: number;
  style?: StyleProp<TextStyle>;
};

export function BackButton({ type, size = 30, style }: Props) {
  const theme = useCurrentTheme();

  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }, style]}
    >
      <IconSymbol
        name={type === "down" ? "chevron.down" : type === "left" ? "chevron.left" : "xmark"}
        size={size}
        color={theme.colors.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeBtn: {},
});
