import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  type: "down" | "left" | "close";
  size?: number;
};

export function BackButton({ type, size = 30 }: Props) {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
    >
      <IconSymbol
        name={type === "down" ? "chevron.down" : type === "left" ? "chevron.left" : "xmark"}
        size={size}
        color={Colors[colorScheme].icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeBtn: {},
});
