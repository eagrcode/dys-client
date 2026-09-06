import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "@/shared/components/icon";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { spacing } from "@/shared/theme/theme";
import { LIST_TYPES } from "../../constants/list-types-config";
import type { List } from "@/features/lists/types/t-list";

type Props = {
  list: List;
  onPress: () => void;
  isFirst: boolean;
};

export function OverviewRow({ list, onPress, isFirst }: Props) {
  const { colors } = useCurrentTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          ...(isFirst ? { paddingTop: spacing[4] } : {}),
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Icon name={LIST_TYPES[list.list_type].icon} size={22} fill={colors.icon.primary} />
      <View style={styles.content}>
        <ThemedText completed={list.completed}>{list.title}</ThemedText>
      </View>
      <Icon name="chevron-right" size={22} fill={colors.icon.soft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
    paddingVertical: spacing[12],
    // marginLeft: spacing[32],
    // marginRight: spacing[16],
  },
  content: {
    flex: 1,
  },
});
