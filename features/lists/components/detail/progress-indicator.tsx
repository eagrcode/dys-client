import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { View, StyleSheet } from "react-native";
import { spacing } from "@/shared/theme/theme";
import type { ListItem } from "../../types/t-list";

type Props = {
  items: ListItem[];
  label: string;
};

export function ProgressIndicator({ items, label }: Props) {
  const { colors } = useCurrentTheme();

  const totalCount = items.length;
  const completedCount = items.filter((i: ListItem) => i.completed).length;

  return (
    <View style={styles.container}>
      <ThemedText variant="tag" style={{ color: colors.accent.primary }}>
        {label}
      </ThemedText>
      <View style={[styles.progressTrack, { backgroundColor: colors.background.layer3 }]}>
        {totalCount > 0 && (
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.accent.primary,
                width: `${(completedCount / totalCount) * 100}%`,
              },
            ]}
          />
        )}
      </View>
      <ThemedText variant="tag">
        {totalCount === 0 ? "0 items" : `${completedCount}/${totalCount}`}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[16],
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
