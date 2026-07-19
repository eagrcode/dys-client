import { ThemedText } from "@/_shared/components/themed-text";
import { BackButton } from "@/_shared/components/back-button";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useLocalSearchParams } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { LIST_TYPE_LABELS } from "@/constants/list-types";
import type { ListItem } from "@/_features/lists/lists-types";

export function Header({
  setOptionsShowing,
}: {
  setOptionsShowing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { data: list } = useListById(listId || "");
  const theme = useCurrentTheme();

  const items = list?.items ?? [];
  const totalCount = items.length;
  const completedCount = items.filter((i: ListItem) => i.completed).length;

  if (!list) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <BackButton type="left" size={30} />
        <ThemedText variant="title" style={styles.title} numberOfLines={2}>
          {list.title}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={[styles.typeChip, { backgroundColor: theme.colors.bgLayer1 }]}>
            <ThemedText style={{ fontSize: 12, color: theme.colors.accent }}>
              {LIST_TYPE_LABELS[list.list_type]}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => setOptionsShowing((prev) => !prev)}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="ellipsis" size={30} color={theme.colors.icon} />
          </Pressable>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {totalCount > 0 && (
          <View style={styles.progressRow}>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.bgLayer1 }]}>
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
            <ThemedText style={styles.progressText}>
              {completedCount}/{totalCount}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    gap: 8,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    letterSpacing: 2,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
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
    opacity: 0.5,
  },
});
