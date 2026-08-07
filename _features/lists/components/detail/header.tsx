import { ThemedText } from "@/_shared/components/themed-text";
import { BackButton } from "@/_shared/components/back-button";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useLocalSearchParams } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { useGroupLists } from "@/_features/lists/hooks/use-lists";
import type { List } from "@/_features/lists/lists-types";

export function Header({
  setOptionsShowing,
}: {
  setOptionsShowing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { data: lists } = useGroupLists();
  const theme = useCurrentTheme();

  const findListById = (id: string) => {
    return lists?.find((list: List) => list.id === id);
  };
  const currentList = findListById(listId || "");

  if (!currentList) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <BackButton type="left" size={30} />
        <ThemedText variant="title" style={styles.title} numberOfLines={2}>
          {currentList?.title || "List"}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={() => setOptionsShowing((prev) => !prev)}
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
