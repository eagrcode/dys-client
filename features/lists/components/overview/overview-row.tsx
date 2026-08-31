import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { spacing } from "@/shared/theme/theme";
import type { List } from "@/features/lists/types/t-list";

type Props = {
  list: List;
  onPress: () => void;
};

export function OverviewRow({ list, onPress }: Props) {
  const { colors } = useCurrentTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* <Icon name={list.completed ? "square-check" : "square"} size={22} /> */}
      <View style={styles.content}>
        <ThemedText completed={list.completed}>{list.title}</ThemedText>
      </View>
      <Icon name="caret-right" size={20} color={colors.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[8],
    paddingVertical: spacing[12],
    marginLeft: spacing[32],
    marginRight: spacing[16],
  },
  content: {
    flex: 1,
  },
});
