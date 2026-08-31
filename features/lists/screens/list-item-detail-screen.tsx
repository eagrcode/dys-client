import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { BackButton } from "@/shared/components/back-button";
import { Button } from "@/shared/components/button";
import { ErrorAlert } from "@/shared/components/alert";
import { Icon } from "@/shared/components/icon";
import { Input } from "@/shared/components/input";
import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { useListById } from "@/features/lists/queries/use-list-id";
import { useToggleCompleteListItem } from "@/features/lists/mutations/use-toggle-complete";
import { useUpdateListItem } from "@/features/lists/mutations/use-update-list-item";
import { renderScreenState } from "../utils/render-screen-state";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import type { ListItem } from "@/features/lists/types/t-list";
import { radius, spacing } from "@/shared/theme/theme";

export function ListItemDetailScreen() {
  const { listId = "", itemId = "" } = useLocalSearchParams<{
    listId: string;
    itemId: string;
  }>();
  const { data: list, error, isPending, isError, isFetching, refetch } = useListById(listId);
  const item = list?.items?.find((listItem) => listItem.id === itemId);

  const stateContent = renderScreenState({
    isPending,
    isError,
    isFetching,
    error,
    refetch,
    isEmpty: !item,
    isEmptyMessage: "List item could not be found",
    type: "list item",
  });

  const content: React.ReactNode = stateContent ?? (
    <ItemDetails key={item?.id} item={item as ListItem} listId={listId} />
  );

  return <ThemedView header={<ItemDetailHeader />}>{content}</ThemedView>;
}

function ItemDetailHeader() {
  return (
    <View style={headerStyles.header}>
      <BackButton type="left" />
      <ThemedText variant="header">Item details</ThemedText>
    </View>
  );
}

function ItemDetails({ item, listId }: { item: ListItem; listId: string }) {
  return (
    <KeyboardAvoidingView
      style={contentStyles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={contentStyles.scrollView}
        contentContainerStyle={contentStyles.contentContainer}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ItemSummary item={item} listId={listId} />
        <RenameItem item={item} listId={listId} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ItemSummary({ item, listId }: { item: ListItem; listId: string }) {
  const theme = useCurrentTheme();
  const { mutate: toggleComplete, isPending } = useToggleCompleteListItem();

  const createdAt = new Date(item.created_at).toLocaleDateString();

  const toggleItem = () => {
    toggleComplete(
      { listId, itemId: item.id, completed: !item.completed },
      {
        onError: (error) => {
          ErrorAlert({ title: "Failed to toggle item completion", error });
        },
      },
    );
  };

  return (
    <View style={[summaryStyles.card]}>
      <Pressable
        onPress={toggleItem}
        disabled={isPending}
        style={({ pressed }) => [
          summaryStyles.icon,
          { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radius.md },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Icon
          name={item.completed ? "check-circle" : "circle"}
          size={24}
          color={item.completed ? theme.colors.accent : theme.colors.icon}
          weight={item.completed ? "fill" : "regular"}
        />
      </Pressable>
      <View style={summaryStyles.content}>
        <ThemedText completed={item.completed}>{item.content}</ThemedText>
        <ThemedText variant="tag" style={summaryStyles.metadata}>
          {item.completed ? "Completed" : "Open"} · Created {createdAt}
        </ThemedText>
      </View>
    </View>
  );
}

function RenameItem({ item, listId }: { item: ListItem; listId: string }) {
  const theme = useCurrentTheme();
  const [content, setContent] = useState(item.content);
  const { mutate: updateListItem, isPending } = useUpdateListItem();
  const trimmedContent = content.trim();
  const isSubmitDisabled =
    trimmedContent.length === 0 || trimmedContent === item.content || isPending;

  const saveItem = () => {
    if (isSubmitDisabled) return;

    updateListItem(
      { listId, itemId: item.id, content: trimmedContent },
      {
        onSuccess: (updatedItem) => setContent(updatedItem.content),
        onError: (error) => ErrorAlert({ title: "Failed to update item", error }),
      },
    );
  };

  return (
    <View style={renameStyles.section}>
      <ThemedText variant="subHeader" style={renameStyles.sectionTitle}>
        Edit
      </ThemedText>
      <View style={[renameStyles.editor]}>
        <Input
          value={content}
          onChangeText={setContent}
          onSubmitEditing={saveItem}
          submitBehavior="blurAndSubmit"
          maxLength={100}
          paddingHorizontal="lg"
          paddingVertical="md"
          borderThickness="hairline"
          radius="sm"
        />
        <Button
          variant="primary"
          loading={isPending}
          disabled={isSubmitDisabled}
          onPress={saveItem}
        >
          <ThemedText variant="button" style={{ color: theme.colors.onAccent }}>
            Save changes
          </ThemedText>
        </Button>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[12],
  },
});

const contentStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    gap: spacing[16],
  },
});

const summaryStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[8],
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: spacing[4],
  },
  metadata: {
    fontSize: 12,
  },
});

const renameStyles = StyleSheet.create({
  section: {
    gap: spacing[8],
  },
  sectionTitle: {
    marginLeft: spacing[4],
  },
  editor: {
    gap: spacing[12],
  },
});
