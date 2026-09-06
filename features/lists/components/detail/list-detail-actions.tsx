import { Fragment, useRef, type Dispatch, type SetStateAction } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
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

type Props = {
  listId: string;
  listMode: ListMode;
  onDismiss: () => void;
  setListMode: Dispatch<SetStateAction<ListMode>>;
};

export function ListDetailActions({ listId, listMode, onDismiss, setListMode }: Props) {
  const theme = useCurrentTheme();
  const sheetRef = useRef<SwipeableModalSheetHandle>(null);
  const { data: list, error, isPending, isError, isFetching, refetch } = useListById(listId);
  const { mutate: toggleCompleteAllListItems, isPending: isToggleCompletePending } =
    useToggleCompleteAllListItems();
  const { mutate: deleteList, isPending: isDeletePending } = useDeleteList();

  const isShowingState = isPending || isError || !list;

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
      setListMode(nextListMode);
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
      setListMode(nextListMode);
    });
  };

  const options: EditOption[] = [
    {
      id: "rename",
      title: "Rename List",
      onPress: handleInitRename,
      icon: "edit",
    },
    {
      id: "toggle-complete",
      title: list?.completed ? "Mark all incomplete" : "Mark all complete",
      onPress: handleToggleComplete,
      disabled: !list?.items?.length,
      loading: isToggleCompletePending,
      icon: list?.completed ? "square" : "check-square",
    },
    {
      id: "delete-selection",
      title: listMode === "select-items" ? "Cancel Delete Selection" : "Delete Selection",
      onPress: handleInitSelectMode,
      disabled: !list?.items?.length,
      icon: "square-dashed",
    },
    {
      id: "delete",
      title: "Delete List",
      onPress: handleDelete,
      destructive: true,
      loading: isDeletePending,
      icon: "trash-x",
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
        <ActivityIndicator color={theme.colors.accent.primary} />
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
              <View style={[styles.separator, { backgroundColor: theme.colors.border.primary }]} />
            ) : null}
          </Fragment>
        ))}
      </View>
    );
  }

  return (
    <SwipeableModalSheet ref={sheetRef} onDismiss={onDismiss} title="List Options">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={isShowingState ? styles.stateContent : undefined}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </SwipeableModalSheet>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  stateContent: {
    justifyContent: "center",
    paddingVertical: spacing[32],
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[12],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
