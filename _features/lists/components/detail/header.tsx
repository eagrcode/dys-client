import { ThemedText } from "@/_shared/components/themed-text";
import { BackButton } from "@/_shared/components/back-button";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ListMode } from "@/_features/lists/types/t-list-ui";

export function Header({
  listId,
  listMode,
  title,
}: {
  listId: string;
  listMode: ListMode;
  title: string;
}) {
  const theme = useCurrentTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <BackButton type="left" size={30} />
        <ThemedText variant="title" style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(app-protected)/(modals)/list-detail-actions",
                params: { listId, listMode },
              })
            }
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="ellipsis" size={30} color={theme.colors.icon} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
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
});
