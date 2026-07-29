import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useState } from "react";
import type { ListItem, ListMode } from "@/_features/lists/lists-types";
import EditListBottomSheet from "@/_features/lists/components/detail/edit-list";
import { Header } from "@/_features/lists/components/detail/header";
import { NewItemInput } from "@/_features/lists/components/detail/new-item-input";
import { ItemRow } from "@/_features/lists/components/detail/item-row";
import { DeleteItemsToolbar } from "@/_features/lists/components/detail/delete-items-toolbar";
import { LIST_TYPE_LABELS } from "@/constants/list-types";
import RetryFetch from "@/_shared/components/retry-fetch";

const SCREEN_PADDING = 16;

function ListDetailScreen() {
  const theme = useCurrentTheme();
  const [listMode, setListMode] = useState<ListMode>("default");
  const [optionsShowing, setOptionsShowing] = useState<boolean>(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const {
    data: list,
    error,
    isLoading,
    refetch,
    isFetching,
    isError,
    isSuccess,
  } = useListById(listId || "");

  const items = list?.items ?? [];
  const isSelectMode = listMode === "select-items";
  const formattedListCreatedAt = list?.created_at
    ? new Date(list.created_at).toLocaleDateString()
    : "";

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          style={{ transform: [{ scale: 1.2 }] }}
          size="small"
          color={theme.colors.accent}
        />
      </View>
    );
  }

  if (isError) {
    return <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="list" />;
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

      <View
        style={[
          styles.listCard,
          {
            backgroundColor: theme.colors.bgLayer1,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <View style={[styles.typeChip, { backgroundColor: theme.colors.bgLayer2 }]}>
            <ThemedText style={{ fontSize: 14, color: theme.colors.accent }}>
              {list && LIST_TYPE_LABELS[list.list_type]}
            </ThemedText>
          </View>
          <ThemedText variant="soft" style={{ fontSize: 14 }}>
            {formattedListCreatedAt}
          </ThemedText>
        </View>

        {list?.items?.length === 0 ? (
          <View style={styles.centered}>
            <ThemedText style={{ opacity: 0.5 }}>Add items to your list</ThemedText>
          </View>
        ) : (
          <FlatList
            style={styles.flatList}
            data={items}
            extraData={{ isSelectMode, selectedItemIds }}
            keyExtractor={(item: ListItem) => item.id}
            contentContainerStyle={styles.listContent}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
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
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_PADDING,
    gap: 16,
    position: "relative",
  },
  listCard: {
    flex: 1,
    minHeight: 0,
    gap: 16,
    padding: SCREEN_PADDING,
  },
  flatList: {
    flex: 1,
    minHeight: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    gap: 8,
    paddingBottom: 16,
  },

  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
});

export { ListDetailScreen };
