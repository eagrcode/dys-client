import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButton } from "@/_shared/components/back-button";
import { Button } from "@/_shared/components/button";
import { ErrorAlert } from "@/_shared/components/alert";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { Input } from "@/_shared/components/input";
import RetryFetch from "@/_shared/components/retry-fetch";
import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useToggleCompleteListItem } from "@/_features/lists/hooks/use-toggle-complete";
import { useUpdateListItem } from "@/_features/lists/hooks/use-update-list-item";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import type { ListItem } from "@/_features/lists/lists-types";

function ListItemDetailScreen() {
  const theme = useCurrentTheme();
  const { listId = "", itemId = "" } = useLocalSearchParams<{
    listId: string;
    itemId: string;
  }>();
  const { data: list, error, isLoading, isError, isFetching, refetch } = useListById(listId);
  const item = list?.items?.find((listItem) => listItem.id === itemId);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <View style={screenStyles.stateContainer}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  } else if (isError) {
    content = <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="item" />;
  } else if (!item) {
    content = (
      <View style={screenStyles.stateContainer}>
        <ThemedText variant="defaultSemiBold">This item could not be found.</ThemedText>
      </View>
    );
  } else {
    content = <ItemDetailContent key={item.id} item={item} listId={listId} />;
  }

  return (
    <ThemedView style={screenStyles.container}>
      <ItemDetailHeader />
      {content}
    </ThemedView>
  );
}

function ItemDetailHeader() {
  return (
    <View style={headerStyles.header}>
      <BackButton type="left" />
      <ThemedText variant="title" style={headerStyles.title}>
        Item details
      </ThemedText>
    </View>
  );
}

function ItemDetailContent({ item, listId }: { item: ListItem; listId: string }) {
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
        <ItemSummary item={item} />
        <RenameItem item={item} listId={listId} />
        <ItemActions item={item} listId={listId} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ItemSummary({ item }: { item: ListItem }) {
  const theme = useCurrentTheme();
  const createdAt = new Date(item.created_at).toLocaleDateString();

  return (
    <View
      style={[
        summaryStyles.card,
        {
          backgroundColor: theme.colors.bgLayer1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <View
        style={[
          summaryStyles.icon,
          { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radius.md },
        ]}
      >
        <IconSymbol
          name={item.completed ? "check-circle" : "circle"}
          size={24}
          color={item.completed ? theme.colors.accent : theme.colors.icon}
        />
      </View>
      <View style={summaryStyles.content}>
        <ThemedText
          variant="defaultSemiBold"
          style={[summaryStyles.itemName, item.completed && summaryStyles.completedItem]}
        >
          {item.content}
        </ThemedText>
        <ThemedText variant="soft" style={summaryStyles.metadata}>
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
      <ThemedText variant="defaultSemiBold" style={renameStyles.sectionTitle}>
        Item
      </ThemedText>
      <View
        style={[
          renameStyles.editor,
          {
            backgroundColor: theme.colors.bgLayer1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Input
          value={content}
          onChangeText={setContent}
          onSubmitEditing={saveItem}
          submitBehavior="blurAndSubmit"
          maxLength={100}
          style={{ padding: 12 }}
        />
        <Button
          variant="primary"
          loading={isPending}
          disabled={isSubmitDisabled}
          onPress={saveItem}
        >
          <ThemedText variant="button">Save changes</ThemedText>
        </Button>
      </View>
    </View>
  );
}

function ItemActions({ item, listId }: { item: ListItem; listId: string }) {
  const { mutate: toggleComplete, isPending } = useToggleCompleteListItem();

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
    <>
      <View style={actionSectionStyles.section}>
        <ThemedText variant="defaultSemiBold" style={actionSectionStyles.sectionTitle}>
          Status
        </ThemedText>
        <ActionRow
          icon={item.completed ? "close-circle" : "check-circle"}
          label={item.completed ? "Mark as incomplete" : "Mark as complete"}
          loading={isPending}
          onPress={toggleItem}
        />
      </View>

      <View style={actionSectionStyles.section}>
        <ThemedText variant="defaultSemiBold" style={actionSectionStyles.sectionTitle}>
          Planning
        </ThemedText>
        <ActionRow icon="person" label="Assigned to" hint="Coming soon" disabled />
        <ActionRow icon="calendar" label="Due date" hint="Coming soon" disabled />
        <ActionRow icon="flag" label="Priority" hint="Coming soon" disabled />
        <ActionRow icon="notifications" label="Reminder" hint="Coming soon" disabled />
      </View>
    </>
  );
}

function ActionRow({
  icon,
  label,
  hint,
  disabled = false,
  loading = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  label: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}) {
  const theme = useCurrentTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        actionRowStyles.row,
        {
          backgroundColor: theme.colors.bgLayer1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.65 : disabled ? 0.5 : 1,
        },
      ]}
    >
      <IconSymbol
        name={icon}
        size={20}
        color={disabled ? theme.colors.textMuted : theme.colors.accent}
      />
      <ThemedText variant="defaultSemiBold" style={actionRowStyles.label}>
        {label}
      </ThemedText>
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.accent} />
      ) : hint ? (
        <ThemedText variant="soft" style={actionRowStyles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    letterSpacing: 1,
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
    gap: 16,
  },
});

const summaryStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
  },
  completedItem: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  metadata: {
    fontSize: 12,
  },
});

const renameStyles = StyleSheet.create({
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 4,
    fontSize: 16,
  },
  editor: {
    gap: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

const actionSectionStyles = StyleSheet.create({
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 4,
    fontSize: 16,
  },
});

const actionRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
  },
});

export { ListItemDetailScreen };
