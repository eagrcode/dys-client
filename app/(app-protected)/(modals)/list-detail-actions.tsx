import { useRef } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useDeleteList } from "@/_features/lists/hooks/use-delete-list";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useRenameList } from "@/_features/lists/hooks/use-rename-list";
import { useToggleCompleteAllListItems } from "@/_features/lists/hooks/use-toggle-complete-all";
import type { ListMode } from "@/_features/lists/types/t-list-ui";
import { ErrorAlert } from "@/_shared/components/alert";
import {
  SwipeableModalSheet,
  type SwipeableModalSheetHandle,
} from "@/_shared/components/modals/swipeable-modal-sheet";
import RetryFetch from "@/_shared/components/retry-fetch";
import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { ActionRow } from "@/_shared/components/action-row";
import { IconSymbol } from "@/_shared/components/icon-symbol";
// import { useGroupMembers } from "@/_features/members/hooks/use-group-members";
// import type { Member } from "@/_features/members/types/t-members";

type EditOption = {
  id: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof IconSymbol>["name"] | null;
};

export default function ListDetailActionsModal() {
  const theme = useCurrentTheme();
  const sheetRef = useRef<SwipeableModalSheetHandle>(null);
  const { listId = "", listMode = "default" } = useLocalSearchParams<{
    listId?: string;
    listMode?: ListMode;
  }>();
  const { data: list, error, isPending, isError, isFetching, refetch } = useListById(listId);
  const { mutate: toggleCompleteAllListItems, isPending: isToggleCompletePending } =
    useToggleCompleteAllListItems();
  const { mutate: deleteList, isPending: isDeletePending } = useDeleteList();
  const { mutate: renameList, isPending: isRenamePending } = useRenameList();
  // const { data: groupMembers } = useGroupMembers(list?.group_id ?? "");

  // const listCreatedByName: string =
  //   groupMembers?.find((member: Member) => member.user_id === list?.created_by)?.first_name ??
  //   "Unknown";

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
      icon: "rename",
    },
    {
      id: "toggle-complete",
      title: list?.completed ? "Mark all incomplete" : "Mark all complete",
      onPress: handleToggleComplete,
      disabled: !list?.items?.length,
      loading: isToggleCompletePending,
      icon: list?.completed ? "checkbox-blank-outline" : "checkbox-outline",
    },
    {
      id: "delete-selection",
      title: listMode === "select-items" ? "Cancel Delete Selection" : "Delete Selection",
      onPress: handleInitSelectMode,
      disabled: !list?.items?.length,
      icon: "close-box-outline",
    },
    {
      id: "delete",
      title: "Delete List",
      onPress: handleDelete,
      destructive: true,
      loading: isDeletePending,
      icon: "delete-forever",
    },
  ];

  let content: React.ReactNode;

  if (!listId) {
    content = (
      <View style={styles.stateContainer}>
        <ThemedText variant="defaultSemiBold">This list could not be found.</ThemedText>
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
        <ThemedText variant="defaultSemiBold">This list could not be found.</ThemedText>
      </View>
    );
  } else {
    content = (
      <View style={styles.options}>
        {options.map((option) => (
          <ActionRow
            key={option.id}
            label={option.title}
            onPress={option.onPress}
            tone={option.destructive ? "danger" : "default"}
            disabled={option.disabled}
            background="bgLayer2"
            icon={option.icon ?? null}
          />
        ))}
      </View>
    );
  }

  return (
    <SwipeableModalSheet ref={sheetRef} fallbackHref={fallbackHref} sheetHeightRatio={0.6}>
      <View style={styles.header}>
        <ThemedText variant="defaultSemiBold" style={{ fontSize: 16 }}>
          List Options
        </ThemedText>
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
    marginBottom: 16,
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
    gap: 12,
  },
  options: {
    gap: 8,
  },
  optionButton: {
    width: "100%",
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  renameContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 2,
    padding: 12,
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  flexButton: {
    flex: 1,
    padding: 12,
  },
});
