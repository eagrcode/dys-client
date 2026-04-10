import { View, StyleSheet, ActivityIndicator, FlatList, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useCreateListItem } from "@/hooks/queries/useCreateListItem";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useToggleCompleteListItem } from "@/hooks/queries/useToggleCompleteListItem";
import { useListById } from "@/hooks/queries/useListById";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BackButton from "@/components/ui/back-button";

const LIST_TYPE_ICONS: Record<string, string> = {
  shopping: "cart.fill",
  todo: "checkmark.circle.fill",
  other: "list.bullet",
};

const LIST_TYPE_LABELS: Record<string, string> = {
  shopping: "Shopping",
  todo: "Todo",
  other: "Other",
};

export default function ListViewScreen() {
  const [newItem, setNewItem] = useState<string>("");
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { selectedGroup } = useGroupsProvider();
  const { data: list, isLoading } = useListById(selectedGroup || "", listId || "");
  const { mutate: createListItem } = useCreateListItem();
  const { mutate: toggleCompleteListItem } = useToggleCompleteListItem();
  const colorScheme = useColorScheme() ?? "light";

  const colors = Colors[colorScheme];
  const completedCount = list?.items?.filter((i: any) => i.completed).length ?? 0;
  const totalCount = list?.items?.length ?? 0;

  const handleAddItemPress = () => {
    if (!newItem.trim()) return;

    console.log("Adding item:", newItem);
    createListItem({ listId: listId || "", content: newItem.trim() });
    setNewItem("");
  };

  const handleToggleCompleteItem = (itemId: string, completed: boolean) => {
    console.log("Toggling item:", itemId, "Completed:", completed);
    toggleCompleteListItem({ listId: listId || "", itemId, completed: !completed });
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  if (!list) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={{ opacity: 0.5 }}>List not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton type="left" size={24} />
          <ThemedText type="title" style={{ fontSize: 20, letterSpacing: 2 }}>
            {list.title}
          </ThemedText>
          <View style={[styles.typeChip, { backgroundColor: colors.bgLayer1 }]}>
            <IconSymbol
              name={LIST_TYPE_ICONS[list.list_type] as any}
              size={14}
              color={colors.tint}
            />
            <ThemedText style={{ fontSize: 12, color: colors.tint }}>
              {LIST_TYPE_LABELS[list.list_type] || list.list_type}
            </ThemedText>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {totalCount > 0 && (
            <View style={styles.progressRow}>
              <View style={[styles.progressTrack, { backgroundColor: colors.bgLayer1 }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.tint,
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

      {/* Input for adding new items */}
      <View
        style={{ flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center" }}
      >
        <Input
          style={{
            flex: 1,
            width: undefined,
          }}
          placeholder="New item"
          value={newItem}
          onChangeText={(content) => setNewItem(content)}
        />
        <Pressable
          onPress={handleAddItemPress}
          disabled={!newItem.trim()}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <IconSymbol name="plus" size={30} color={!newItem.trim() ? colors.icon : colors.tint} />
        </Pressable>
      </View>

      {/* Placeholder for empty list */}
      {totalCount === 0 ? (
        <View style={styles.centered}>
          <IconSymbol name="tray" size={40} color={colors.icon} />
          <ThemedText style={{ opacity: 0.5, marginTop: 12 }}>No items yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }: { item: any; index: number }) => (
            <View
              style={[
                styles.itemRow,
                {
                  borderBottomWidth: index < totalCount - 1 ? 1 : 0,
                  borderBottomColor: colors.bgLayer1,
                },
              ]}
            >
              <Pressable onPress={() => handleToggleCompleteItem(item.id, item.completed)}>
                <IconSymbol
                  name={item.completed ? "checkmark.circle.fill" : "circle"}
                  size={25}
                  color={item.completed ? colors.tint : colors.icon}
                />
              </Pressable>

              <ThemedText
                style={[
                  styles.itemText,
                  item.completed && {
                    textDecorationLine: "line-through",
                    opacity: 0.4,
                  },
                ]}
              >
                {item.content}
              </ThemedText>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 60,
    gap: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  title: {
    fontSize: 16,
    letterSpacing: 3,
  },
  progressRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
  listContent: {},
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
});
