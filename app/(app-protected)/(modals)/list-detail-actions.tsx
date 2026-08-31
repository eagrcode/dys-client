import { Fragment, useRef } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useDeleteList } from "@/features/lists/mutations/use-delete-list";
import { useListById } from "@/features/lists/queries/use-list-id";
import { useToggleCompleteAllListItems } from "@/features/lists/mutations/use-toggle-complete-all";
import type { ListMode } from "@/features/lists/types/t-list-ui";
import { ErrorAlert } from "@/shared/components/alert";
import { RetryFetch } from "@/shared/components/retry-fetch";
import { ThemedText } from "@/shared/components/themed-text";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { ActionRow } from "@/shared/components/action-row";
import type { IconName } from "@/shared/components/icon";
import {
  SwipeableModalSheet,
  type SwipeableModalSheetHandle,
} from "@/shared/components/modals/swipeable-modal-sheet";
import { spacing } from "@/shared/theme/theme";

type EditOption = {
  id: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName | null;
};

export default function ListDetailActionsModal() {
  const theme = useCurrentTheme();
  const sheetRef = useRef<SwipeableModalSheetHandle>(null);
  const { listId, listMode = "default" } = useLocalSearchParams<{
    listId: string;
    listMode: ListMode;
  }>();
  const { data: list, error, isPending, isError, isFetching, refetch } = useListById(listId);
  const { mutate: toggleCompleteAllListItems, isPending: isToggleCompletePending } =
    useToggleCompleteAllListItems();
  const { mutate: deleteList, isPending: isDeletePending } = useDeleteList();

  const fallbackHref: Href = listId
    ? {
        pathname: "/(app-protected)/lists/[listId]/detail",
        params: { listId },
      }
    : "/(app-protected)/lists/overview";

  const isShowingState = !listId || isPending || isError || !list;

  const handleToggleComplete = () => {
    if (!list || isToggleCompletePending) return;

    toggleCompleteAllListItems(
      { listId, completed: !list.completed },
      {
        onError: (mutationError) => {
          ErrorAlert({
            title: "Failed to toggle completion of items",
            error: mutationError,
          });
        },
      },
    );
  };

  const handleInitSelectMode = () => {
    const nextListMode: ListMode = listMode === "select-items" ? "default" : "select-items";

    sheetRef.current?.dismiss(() => {
      router.dismissTo({
        pathname: "/(app-protected)/lists/[listId]/detail",
        params: { listId, mode: nextListMode },
      });
    });
  };

  const handleDelete = () => {
    if (!list || isDeletePending) return;

    Alert.alert(`Delete '${list.title}'`, "List and all items will be removed", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteList(listId, {
            onSuccess: () => {
              router.dismissTo("/(app-protected)/lists/overview");
            },
            onError: (mutationError) => {
              ErrorAlert({
                title: "Failed to delete list",
                error: mutationError,
              });
            },
          });
        },
      },
    ]);
  };

  const handleInitRename = () => {
    const nextListMode: ListMode = "renaming";
    sheetRef.current?.dismiss(() => {
      router.dismissTo({
        pathname: "/(app-protected)/lists/[listId]/detail",
        params: { listId, mode: nextListMode },
      });
    });
  };

  const options: EditOption[] = [
    {
      id: "rename",
      title: "Rename List",
      onPress: handleInitRename,
      icon: "pencil-simple",
    },
    {
      id: "toggle-complete",
      title: list?.completed ? "Mark all incomplete" : "Mark all complete",
      onPress: handleToggleComplete,
      disabled: !list?.items?.length,
      loading: isToggleCompletePending,
      icon: list?.completed ? "square" : "square-check",
    },
    {
      id: "delete-selection",
      title: listMode === "select-items" ? "Cancel Delete Selection" : "Delete Selection",
      onPress: handleInitSelectMode,
      disabled: !list?.items?.length,
      icon: "selection",
    },
    {
      id: "delete",
      title: "Delete List",
      onPress: handleDelete,
      destructive: true,
      loading: isDeletePending,
      icon: "trash",
    },
  ];

  let content: React.ReactNode;

  if (!listId) {
    content = (
      <View style={styles.stateContainer}>
        <ThemedText>This list could not be found.</ThemedText>
      </View>
    );
  } else if (isPending) {
    content = (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  } else if (isError) {
    content = <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="list" />;
  } else if (!list) {
    content = (
      <View style={styles.stateContainer}>
        <ThemedText>This list could not be found.</ThemedText>
      </View>
    );
  } else {
    content = (
      <View>
        {options.map((option, index) => (
          <Fragment key={option.id}>
            <ActionRow
              label={option.title}
              onPress={option.onPress}
              tone={option.destructive ? "danger" : "default"}
              disabled={option.disabled}
              loading={option.loading}
              icon={option.icon ?? null}
            />
            {index < options.length - 1 ? (
              <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
            ) : null}
          </Fragment>
        ))}
      </View>
    );
  }

  return (
    <SwipeableModalSheet ref={sheetRef} fallbackHref={fallbackHref} sheetHeightRatio={0.6}>
      <View style={styles.header}>
        <ThemedText variant="button">List Options</ThemedText>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, isShowingState && styles.stateContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </SwipeableModalSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginBottom: spacing[16],
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  stateContent: {
    justifyContent: "center",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[12],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
