import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/input";
import { useToggleCompleteListItem } from "@/hooks/queries/useToggleCompleteListItem";
import { useUpdateListItem } from "@/hooks/queries/useUpdateListItem";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { ListItem } from "@/utils/types/T_Lists";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import type { ListMode } from "../[listId]";

type ItemRowProps = {
  item: ListItem;
  listMode: ListMode;
  editingItemId: string | null;
  setEditingItemId: React.Dispatch<React.SetStateAction<string | null>>;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
  selectedItemIds: Set<string>;
  setSelectedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function ItemRow({
  item,
  listMode,
  setListMode,
  selectedItemIds,
  setSelectedItemIds,
  editingItemId,
  setEditingItemId,
}: ItemRowProps) {
  const isEditingThisItem = editingItemId === item.id;

  return (
    <View style={itemRowStyles.itemRow}>
      <ToggleComplete item={item} listMode={listMode} />
      {listMode === "edit-item" && isEditingThisItem ? (
        <EditMode item={item} setListMode={setListMode} setEditingItemId={setEditingItemId} />
      ) : (
        <DefaultMode
          item={item}
          listMode={listMode}
          setListMode={setListMode}
          setEditingItemId={setEditingItemId}
          selectedItemIds={selectedItemIds}
          setSelectedItemIds={setSelectedItemIds}
        />
      )}
    </View>
  );
}

type DefaultModeProps = {
  item: ListItem;
  listMode: ListMode;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
  setEditingItemId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedItemIds: Set<string>;
  setSelectedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const DefaultMode = ({
  item,
  listMode,
  setListMode,
  setEditingItemId,
  selectedItemIds,
  setSelectedItemIds,
}: DefaultModeProps) => {
  const theme = useCurrentTheme();
  const isSelectedForDelete = selectedItemIds.has(item.id);

  const handleSelectItemsToDelete = () => {
    if (listMode !== "select-items") return;

    setSelectedItemIds((prev) => {
      const id = item.id;
      const newSet = new Set(prev);

      console.log(id);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  };

  const handleOnLongPress = () => {
    if (listMode === "select-items") return;

    setListMode("edit-item");
    setEditingItemId(item.id);
  };

  return (
    <Pressable
      onPress={handleSelectItemsToDelete}
      onLongPress={handleOnLongPress}
      style={itemRowStyles.itemContainer}
    >
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
      {listMode === "select-items" && (
        <IconSymbol
          name={isSelectedForDelete ? "square-r" : "square-ro"}
          color={isSelectedForDelete ? theme.colors.errorText : theme.colors.icon}
          size={20}
        />
      )}
    </Pressable>
  );
};

type ToggleCompleteProps = {
  item: ListItem;
  listMode: ListMode;
};

const ToggleComplete = ({ item, listMode }: ToggleCompleteProps) => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { mutate: toggleCompleteListItem } = useToggleCompleteListItem();
  const theme = useCurrentTheme();
  const isDisabled = listMode !== "default";

  const handleToggleCompleteItem = (itemId: string, completed: boolean) => {
    toggleCompleteListItem({ listId: listId, itemId, completed: !completed });
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => handleToggleCompleteItem(item.id, item.completed)}
      style={{ opacity: isDisabled ? 0.5 : 1 }}
    >
      <IconSymbol
        name={item.completed ? "check-circle" : "circle"}
        size={20}
        color={item.completed ? theme.colors.accentSoft : theme.colors.icon}
      />
    </Pressable>
  );
};

type EditModeProps = {
  item: ListItem;
  setEditingItemId: React.Dispatch<React.SetStateAction<string | null>>;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
};

const EditMode = ({ item, setListMode, setEditingItemId }: EditModeProps) => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [newItemContent, setNewItemContent] = useState<string>(item.content);
  const { mutate: updateListItem } = useUpdateListItem();
  const theme = useCurrentTheme();

  const resetEditingState = () => {
    setListMode("default");
    setEditingItemId(null);
  };

  const handleSubmit = () => {
    if (item.content === newItemContent.trim()) {
      resetEditingState();
      return;
    }

    updateListItem({ listId, itemId: item.id, content: newItemContent.trim() });
    resetEditingState();
  };

  const handleCancel = () => {
    resetEditingState();
  };

  return (
    <View style={itemRowStyles.container}>
      <Input
        value={newItemContent}
        onChangeText={(content) => setNewItemContent(content)}
        submitBehavior="submit"
        keyboardType="default"
        autoFocus
        style={editModeStyles.input}
      />
      {/* Submit/Cancel Buttons */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Pressable onPress={handleSubmit} hitSlop={15}>
          <IconSymbol name="check" size={20} color={theme.colors.icon} />
        </Pressable>
        <Pressable onPress={handleCancel} hitSlop={15}>
          <IconSymbol name="close" size={20} color={theme.colors.danger} />
        </Pressable>
      </View>
    </View>
  );
};

const itemRowStyles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "space-between", gap: 16 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

const editModeStyles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    borderWidth: 0,
    marginLeft: 8,
    width: undefined,
  },
});
