import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useState } from "react";
import type { ListItem } from "@/_features/lists/lists-types";
import EditListBottomSheet from "@/_features/lists/components/edit-list";
import { Header } from "@/_features/lists/components/header";
import { NewItemInput } from "@/_features/lists/components/new-item-input";
import { ItemRow } from "@/_features/lists/components/item-row";
import { DeleteItemsToolbar } from "@/_features/lists/components/delete-items-toolbar";

const SCREEN_PADDING = 16;

export type ListMode = "default" | "edit-item" | "select-items";

export default function ListViewScreen() {
  const [listMode, setListMode] = useState<ListMode>("default");
  const [optionsShowing, setOptionsShowing] = useState<boolean>(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { data: list, isLoading } = useListById(listId || "");
  const theme = useCurrentTheme();
  const items = list?.items ?? [];
  const totalCount = items.length;

  const isSelectMode = listMode === "select-items";

  console.log("List Mode: ", listMode);

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
      <Header setOptionsShowing={setOptionsShowing} />
      {isSelectMode ? (
        <DeleteItemsToolbar
          selectedItemIds={selectedItemIds}
          setSelectedItemIds={setSelectedItemIds}
          setListMode={setListMode}
        />
      ) : (
        <NewItemInput />
      )}

      {totalCount === 0 ? (
        <PlaceHolder />
      ) : (
        <FlatList
          data={items}
          extraData={{ isSelectMode, selectedItemIds }}
          keyExtractor={(item: ListItem) => item.id}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          renderItem={({ item }: { item: ListItem }) => (
            <ItemRow
              item={item}
              listMode={listMode}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
              setListMode={setListMode}
              selectedItemIds={selectedItemIds}
              setSelectedItemIds={setSelectedItemIds}
            />
          )}
        />
      )}
      {optionsShowing && (
        <EditListBottomSheet
          listMode={listMode}
          setListMode={setListMode}
          setOptionsShowing={setOptionsShowing}
        />
      )}
    </ThemedView>
  );
}

const PlaceHolder = () => {
  return (
    <View style={styles.centered}>
      {/* <IconSymbol name="tray" size={40} color={theme.colors.icon} /> */}
      <ThemedText style={{ opacity: 0.5, marginTop: 12 }}>No items yet</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    gap: 16,
    position: "relative",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING,
    gap: 24,
  },
});
