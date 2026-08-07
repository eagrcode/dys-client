import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { View, StyleSheet } from "react-native";
import type { ListItem } from "../../lists-types";

type Props = {
  items: ListItem[];
};

const ProgressIndicator = ({ items }: Props) => {
  const theme = useCurrentTheme();

  const totalCount = items.length;
  const completedCount = items.filter((i: ListItem) => i.completed).length;

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {totalCount > 0 && (
        <View style={styles.progressRow}>
          <ThemedText style={styles.progressText}>
            {completedCount}/{totalCount}
          </ThemedText>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.bgLayer3 }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.accent,
                  width: `${(completedCount / totalCount) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
  },
});

export { ProgressIndicator };
