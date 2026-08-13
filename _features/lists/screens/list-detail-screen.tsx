import { View, StyleSheet, ActivityIndicator, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useEffect, useState } from "react";
import { Header } from "@/_features/lists/components/detail/header";
import { NewItemInput } from "@/_features/lists/components/detail/new-item-input";
import { ItemRow } from "@/_features/lists/components/detail/item-row";
import { DeleteItems } from "@/_features/lists/components/detail/delete-items";
import RetryFetch from "@/_shared/components/retry-fetch";
import { ProgressIndicator } from "@/_features/lists/components/detail/progress-indicator";
import type { ListItem } from "@/_features/lists/types/t-list";
import type { ListMode } from "@/_features/lists/types/t-list-ui";
import { LIST_TYPES, type ListType } from "@/_features/lists/constants/list-types-config";
import { IconSymbol } from "@/_shared/components/icon-symbol";

const SCREEN_PADDING = 16;

function ListDetailScreen() {
  const theme = useCurrentTheme();
  const router = useRouter();
  const [listMode, setListMode] = useState<ListMode>("default");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const {
    listId = "",
    title: routeTitle,
    listType: routeListType,
    createdAt: routeCreatedAt,
    mode: requestedListMode,
  } = useLocalSearchParams<{
    listId: string;
    title?: string;
    listType?: ListType;
    createdAt?: string;
    mode?: ListMode;
  }>();
  const { data: list, error, isPending, refetch, isFetching, isError } = useListById(listId);

  const isSelectMode = listMode === "select-items";
  const items = list?.items ?? [];
  const sortedItems = items.sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
  );
  const title = list?.title ?? routeTitle ?? "List";
  const listType = list?.list_type ?? routeListType;
  const createdAt = list?.created_at ?? routeCreatedAt;

  const cancelSelection = () => {
    setSelectedItemIds(new Set());
    setListMode("default");
  };

  useEffect(() => {
    if (!requestedListMode) return;

    setListMode(requestedListMode);
    router.setParams({ mode: undefined });
  }, [requestedListMode, router]);

  let content: React.ReactNode;

  if (isPending) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator
          style={{ transform: [{ scale: 1.2 }] }}
          size="small"
          color={theme.colors.accent}
        />
      </View>
    );
  } else if (isError) {
    content = <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="items" />;
  } else if (!list) {
    content = (
      <View style={styles.centered}>
        <ThemedText variant="defaultSemiBold">This list could not be found.</ThemedText>
      </View>
    );
  } else if (items.length === 0) {
    content = (
      <View style={styles.centered}>
        <ThemedText style={{ opacity: 0.5 }}>Add items to your list</ThemedText>
      </View>
    );
  } else {
    content = (
      <FlatList
        style={styles.flatList}
        data={sortedItems}
        extraData={{ isSelectMode, selectedItemIds }}
        keyExtractor={(item: ListItem) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: ListItem }) => (
          <ItemRow
            item={item}
            listMode={listMode}
            selectedItemIds={selectedItemIds}
            setSelectedItemIds={setSelectedItemIds}
          />
        )}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header
        listId={listId}
        listMode={listMode}
        title={title}
        onCancelSelection={cancelSelection}
      />
      <NewItemInput />
      <ItemsCard listType={listType} createdAt={createdAt} items={items}>
        {content}
      </ItemsCard>
      {isSelectMode && (
        <DeleteItems
          selectedItemIds={selectedItemIds}
          setSelectedItemIds={setSelectedItemIds}
          setListMode={setListMode}
          onCancelSelection={cancelSelection}
        />
      )}
    </ThemedView>
  );
}

type ItemsCardProps = {
  listType?: ListType;
  createdAt?: string;
  items: ListItem[];
  children: React.ReactNode;
};

const ItemsCard = ({ listType, createdAt, items, children }: ItemsCardProps) => {
  const theme = useCurrentTheme();
  const formattedListCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString() : "—";
  const listTypeLabel = listType ? LIST_TYPES[listType].label : "—";

  return (
    <View
      style={[
        styles.listCard,
        {
          backgroundColor: theme.colors.bgLayer1,
          borderRadius: theme.radius.xl,
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
        <View style={[styles.typeChip, { backgroundColor: theme.colors.bgLayer3 }]}>
          <ThemedText style={{ fontSize: 14, color: theme.colors.accent }}>
            {listTypeLabel}
          </ThemedText>
        </View>
        <ThemedText variant="soft" style={{ fontSize: 14 }}>
          {formattedListCreatedAt}
        </ThemedText>
      </View>

      <ProgressIndicator items={items} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    position: "relative",
  },
  listCard: {
    flex: 1,
    minHeight: 0,
    gap: 16,
    padding: SCREEN_PADDING,
    borderWidth: StyleSheet.hairlineWidth,
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
