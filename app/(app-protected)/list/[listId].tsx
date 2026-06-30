import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useListById } from "@/hooks/queries/useListById";
import { useState } from "react";
import type { ListItem } from "@/utils/types/T_Lists";
import EditListBottomSheet from "@/components/ui/edit-list";
import { Header } from "./components/Header";
import { NewItemInput } from "./components/NewItemInput";
import { ItemRow } from "./components/ItemRow";
import { DeleteItemsToolbar } from "./components/DeleteItemsToolbar";

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
