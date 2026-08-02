import { ThemedText } from "@/_shared/components/themed-text";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { Input } from "@/_shared/components/input";
import { useToggleCompleteListItem } from "@/_features/lists/hooks/use-toggle-complete";
import { useUpdateListItem } from "@/_features/lists/hooks/use-update-list-item";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { ListItem } from "@/_features/lists/lists-types";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import type { ListMode } from "@/_features/lists/lists-types";
import { ErrorAlert } from "@/_shared/components/alert";

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
  const theme = useCurrentTheme();

  return (
    <View
      style={[
        itemRowStyles.itemRow,
        {
          backgroundColor: theme.colors.bgLayer2,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadow.sm,
        },
      ]}
    >
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
      style={[itemRowStyles.itemContainer]}
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
  const { mutate: toggleCompleteListItem, isPending: isTogglePending } =
    useToggleCompleteListItem();
  const theme = useCurrentTheme();

  const isDisabled = listMode !== "default" || isTogglePending;

  const handleToggleCompleteItem = (itemId: string, completed: boolean) => {
    toggleCompleteListItem(
      { listId: listId, itemId, completed: !completed },
      {
        onError: (error) => {
          ErrorAlert({
            title: "Failed to toggle item completion",
            error,
          });
        },
      },
    );
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
  const { mutate: updateListItem, isPending: isUpdatePending } = useUpdateListItem();
  const theme = useCurrentTheme();
  const isSubmitDisabled =
    newItemContent.trim() === "" || newItemContent.trim() === item.content || isUpdatePending;

  const resetEditingState = () => {
    setListMode("default");
    setEditingItemId(null);
  };

  const handleSubmit = () => {
    updateListItem(
      { listId, itemId: item.id, content: newItemContent.trim() },
      {
        onSuccess: () => {
          resetEditingState();
        },
        onError: (error) => {
          ErrorAlert({ title: "Failed to update item", error });
        },
      },
    );
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
        maxLength={100}
      />
      {/* Submit/Cancel Buttons */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Pressable
          style={{ opacity: isSubmitDisabled ? 0.4 : 1 }}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
          hitSlop={15}
        >
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
    width: "100%",
    padding: 12,
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
