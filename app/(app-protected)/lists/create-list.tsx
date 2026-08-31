import { ThemedText } from "@/shared/components/themed-text";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { ThemedView } from "@/shared/components/themed-view";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useCreateList } from "@/features/lists/mutations/use-create-list";
import { IconSymbol } from "@/shared/components/icon";
import { ErrorAlert } from "@/shared/components/alert";

type ListType = "todo" | "shopping" | "other";

const LIST_TYPE_LABELS: Record<ListType, string> = {
  shopping: "Shopping",
  todo: "Todo",
  other: "Other",
};

const LIST_TYPE_ICONS: Record<ListType, string> = {
  shopping: "cart.fill",
  todo: "checkmark.circle.fill",
  other: "list.bullet",
};

const LIST_TYPE_TITLES: Record<ListType, string> = {
  shopping: "New Shopping List",
  todo: "New Todo List",
  other: "New List",
};

const LIST_TYPE_ARR: ListType[] = ["todo", "shopping", "other"];

export default function CreateListModal() {
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ListType>("todo");
  const theme = useCurrentTheme();
  const { mutate: createList, isPending: isCreatePending } = useCreateList();

  const canSubmit = newTitle.trim().length > 0;
  const buttonDisabled = !canSubmit || isCreatePending;
  const titleText = LIST_TYPE_TITLES[newType];

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createList(
      { title: newTitle.trim(), listType: newType },
      {
        onError: (error) => {
          ErrorAlert({
            title: "Failed to create list",
            error: error,
          });
        },
      },
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="title" style={{ fontSize: 18 }}>
        Choose List type
      </ThemedText>
      <View style={styles.selectorContainer}>
        {LIST_TYPE_ARR.map((type) => (
          <Pressable
            key={type}
            onPress={() => setNewType(type)}
            style={[
              styles.typeSelector,
              {
                backgroundColor: newType === type ? theme.colors.bgLayer3 : theme.colors.bgLayer2,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <IconSymbol
              name={LIST_TYPE_ICONS[type] as any}
              size={20}
              color={newType === type ? theme.colors.text : theme.colors.textMuted}
            />
            <ThemedText
              variant="defaultSemiBold"
              style={{
                color: newType === type ? theme.colors.text : theme.colors.textMuted,
              }}
            >
              {LIST_TYPE_LABELS[type]}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText variant="title" style={{ fontSize: 18 }}>
        {titleText}
      </ThemedText>

      <View
        style={[
          styles.inputContainer,
          { borderColor: theme.colors.bgLayer3, borderRadius: theme.radius.lg },
        ]}
      >
        <IconSymbol name={LIST_TYPE_ICONS[newType] as any} size={20} color={theme.colors.text} />
        <Input
          value={newTitle}
          onChangeText={setNewTitle}
          editable={!isCreatePending}
          autoFocus
          placeholder="Title"
          style={styles.input}
          maxLength={100}
        />
      </View>

      <Button
        variant="primary"
        onPress={handleCreate}
        loading={isCreatePending}
        disabled={buttonDisabled}
        style={{ borderRadius: theme.radius.xl }}
      >
        <ThemedText variant="button">Create List</ThemedText>
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  selectorContainer: {
    gap: 8,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputContainer: {
    width: "100%",
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
  },
});
