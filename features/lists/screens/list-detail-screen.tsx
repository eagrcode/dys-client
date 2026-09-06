import {
  Header,
  DeleteItems,
  AddItem,
  ProgressIndicator,
  DetailRow,
  ListDetailActions,
} from "@/features/lists/components/detail";
import { StyleSheet, FlatList } from "react-native";
import { spacing } from "@/shared/theme/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedView } from "@/shared/components/themed-view";
import { useListById } from "@/features/lists/queries/use-list-id";
import { useEffect, useState } from "react";
import { LIST_TYPES } from "@/features/lists/constants/list-types-config";
import { renderScreenState } from "@/features/lists/utils/render-screen-state";
import type { ListItem } from "@/features/lists/types/t-list";
import type { ListMode } from "@/features/lists/types/t-list-ui";

export function ListDetailScreen() {
  const { listId, mode: requestedListMode } = useLocalSearchParams<{
    listId: string;
    mode: ListMode;
  }>();

  const [listMode, setListMode] = useState<ListMode>(requestedListMode ?? "default");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [areListActionsVisible, setAreListActionsVisible] = useState(false);
  const router = useRouter();

  const { data: list, error, isPending, refetch, isFetching, isError } = useListById(listId);

  const isSelectMode = listMode === "select-items";
  const items = list?.items ?? [];
  const title = list?.title ?? "List";
  const listTypeLabel = list ? LIST_TYPES[list.list_type].label : "";
  const canAddItems = !isPending && !isError && list !== undefined;
  const headerOptionsDisabled = isPending || isError || list === undefined;

  const cancelSelection = () => {
    setSelectedItemIds(new Set());
    setListMode("default");
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (nextIds.has(itemId)) {
        nextIds.delete(itemId);
      } else {
        nextIds.add(itemId);
      }

      return nextIds;
    });
  };

  useEffect(() => {
    if (!requestedListMode) return;

    setListMode(requestedListMode);
    router.setParams({ mode: undefined });
  }, [requestedListMode, router]);

  const stateContent = renderScreenState({
    isPending,
    isError,
    isFetching,
    error,
    refetch,
    isEmpty: items.length === 0,
    isEmptyMessage: "Add items to your list",
    type: "list items",
  });

  const content: React.ReactNode = stateContent ?? (
    <>
      <ProgressIndicator items={items} label={listTypeLabel} />
      <ItemsList
        key={listId}
        items={items}
        listId={listId}
        listMode={listMode}
        selectedItemIds={selectedItemIds}
        onToggleSelected={toggleItemSelection}
      />
    </>
  );

  return (
    <>
      <ThemedView
        isSecondary
        header={
          <Header
            title={title}
            listId={listId}
            listMode={listMode}
            setListMode={setListMode}
            onCancelSelection={cancelSelection}
            onOpenOptions={() => setAreListActionsVisible(true)}
            optionsDisabled={headerOptionsDisabled}
          />
        }
      >
        {canAddItems && <AddItem listId={listId} />}
        {content}
        {isSelectMode && canAddItems && (
          <DeleteItems
            listId={listId}
            selectedItemIds={selectedItemIds}
            onCancelSelection={cancelSelection}
          />
        )}
      </ThemedView>

      {areListActionsVisible ? (
        <ListDetailActions
          listId={listId}
          listMode={listMode}
          setListMode={setListMode}
          onDismiss={() => setAreListActionsVisible(false)}
        />
      ) : null}
    </>
  );
}

type ItemsListProps = {
  listId: string;
  items: ListItem[];
  listMode: ListMode;
  selectedItemIds: Set<string>;
  onToggleSelected: (itemId: string) => void;
};

function ItemsList({ listId, items, listMode, selectedItemIds, onToggleSelected }: ItemsListProps) {
  const sortedItems = [...items].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
  );

  return (
    <FlatList
      style={listStyles.flatList}
      data={sortedItems}
      extraData={{ listMode, selectedItemIds }}
      keyExtractor={(item: ListItem) => item.id}
      contentContainerStyle={listStyles.listContent}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }: { item: ListItem }) => (
        <DetailRow
          item={item}
          listId={listId}
          listMode={listMode}
          selected={selectedItemIds.has(item.id)}
          onToggleSelected={onToggleSelected}
        />
      )}
    />
  );
}

const listStyles = StyleSheet.create({
  flatList: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingBottom: spacing[16],
  },
});
