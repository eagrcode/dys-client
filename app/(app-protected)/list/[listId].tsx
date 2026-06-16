import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  type TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useCreateListItem } from "@/hooks/queries/useCreateListItem";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useToggleCompleteListItem } from "@/hooks/queries/useToggleCompleteListItem";
import { useListById } from "@/hooks/queries/useListById";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { BackButton } from "@/components/ui/back-button";

type ListItem = {
  id: string;
  list_id: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type List = {
  id: string;
  title: string;
  list_type: string;
  created_by: string;
  group_id: string;
  assigned_to?: string;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  items: ListItem[];
};

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

const SCREEN_PADDING = 16;

export default function ListViewScreen() {
  const [newItem, setNewItem] = useState<string>("");
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { selectedGroup } = useGroupsProvider();
  const { data: list, isLoading } = useListById(selectedGroup || "", listId || "");
  const { mutate: createListItem } = useCreateListItem();
  const { mutate: toggleCompleteListItem } = useToggleCompleteListItem();
  const theme = useCurrentTheme();
  const completedCount = list?.items?.filter((i: ListItem) => i.completed).length ?? 0;
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
        <ActivityIndicator size="large" color={theme.colors.accent} />
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
      <Header list={list} completedCount={completedCount} totalCount={totalCount} />
      <NewItemInput
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItemPress={handleAddItemPress}
      />

      {/* Placeholder for empty list */}
      {totalCount === 0 ? (
        <View style={styles.centered}>
          <IconSymbol name="tray" size={40} color={theme.colors.icon} />
          <ThemedText style={{ opacity: 0.5, marginTop: 12 }}>No items yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item: ListItem) => item.id}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          renderItem={({ item }: { item: ListItem }) => (
            <ItemRow item={item} handleToggleCompleteItem={handleToggleCompleteItem} />
          )}
        />
      )}
    </ThemedView>
  );
}

function Header({
  list,
  completedCount,
  totalCount,
}: {
  list: List;
  completedCount: number;
  totalCount: number;
}) {
  const theme = useCurrentTheme();

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerTop}>
        <BackButton type="left" size={24} />
        <ThemedText variant="title" style={headerStyles.title}>
          {list.title}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={[headerStyles.typeChip, { backgroundColor: theme.colors.bgLayer1 }]}>
            <IconSymbol
              name={LIST_TYPE_ICONS[list.list_type] as any}
              size={14}
              color={theme.colors.accent}
            />
            <ThemedText style={{ fontSize: 12, color: theme.colors.accent }}>
              {LIST_TYPE_LABELS[list.list_type] || list.list_type}
            </ThemedText>
          </View>
          <IconSymbol name="ellipsis" size={30} color={theme.colors.icon} />
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {totalCount > 0 && (
          <View style={headerStyles.progressRow}>
            <View
              style={[headerStyles.progressTrack, { backgroundColor: theme.colors.bgLayer1 }]}
            >
              <View
                style={[
                  headerStyles.progressFill,
                  {
                    backgroundColor: theme.colors.accent,
                    width: `${(completedCount / totalCount) * 100}%`,
                  },
                ]}
              />
            </View>
            <ThemedText style={headerStyles.progressText}>
              {completedCount}/{totalCount}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

function NewItemInput({
  newItem,
  setNewItem,
  handleAddItemPress,
}: {
  newItem: string;
  setNewItem: (content: string) => void;
  handleAddItemPress: () => void;
}) {
  const theme = useCurrentTheme();
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        newItemInputStyles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <IconSymbol
        name="plus"
        size={30}
        color={!newItem.trim() ? theme.colors.textMuted : theme.colors.icon}
      />
      <Input
        ref={inputRef}
        style={[newItemInputStyles.input]}
        placeholder="New item"
        value={newItem}
        onChangeText={(content) => setNewItem(content)}
        onSubmitEditing={handleAddItemPress}
        submitBehavior="submit"
      />
    </View>
  );
}

function ItemRow({
  item,
  handleToggleCompleteItem,
}: {
  item: ListItem;
  handleToggleCompleteItem: (id: string, completed: boolean) => void;
}) {
  const theme = useCurrentTheme();

  return (
    <View style={[itemRowStyles.itemRow]}>
      <Pressable onPress={() => handleToggleCompleteItem(item.id, item.completed)}>
        <IconSymbol
          name={item.completed ? "checkmark.circle.fill" : "circle"}
          size={25}
          color={item.completed ? theme.colors.accentSoft : theme.colors.icon}
        />
      </Pressable>

      <ThemedText
        style={[
          itemRowStyles.itemText,
          item.completed && {
            textDecorationLine: "line-through",
            opacity: 0.4,
          },
        ]}
      >
        {item.content}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
});

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 60,
    gap: 8,
    paddingHorizontal: SCREEN_PADDING,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  title: { fontSize: 20, letterSpacing: 2 },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
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

const newItemInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: SCREEN_PADDING,
    // borderLeftWidth: 0,
    // borderRightWidth: 0,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    width: undefined,
    borderWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
});

const itemRowStyles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
});
