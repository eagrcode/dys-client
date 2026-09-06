import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { router } from "expo-router";
import { Pressable, StyleProp, ViewStyle, StyleSheet, View } from "react-native";
import { spacing } from "@/shared/theme/theme";
import { Icon } from "./icon";

type Props = {
  type: "left" | "close";
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({ type, size = 30, style }: Props) {
  const { colors } = useCurrentTheme();

  return (
    // <Pressable
    //   onPress={() => router.back()}
    //   hitSlop={10}
    //   style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, style]}
    // >
    //   <View style={[styles.container, { backgroundColor: colors.background.layer2 }]}>
    //     <View style={{ position: "absolute", right: 4 }}>
    //       <Icon name={type === "left" ? "chevron-left" : "x"} size={size} fill={colors.icon.primary} />
    //     </View>
    //   </View>
    // </Pressable>

    <Pressable
      onPress={() => router.back()}
      hitSlop={15}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Icon name={type === "left" ? "chevron-left" : "x"} size={size} fill={colors.icon.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    height: 35,
    width: 35,
  },
});
