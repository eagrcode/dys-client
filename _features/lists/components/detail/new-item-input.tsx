import { IconSymbol } from "@/_shared/components/icon-symbol";
import { Input } from "@/_shared/components/input";
import { useCreateListItem } from "@/_features/lists/hooks/use-create-list-item";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ErrorAlert } from "@/_shared/components/alert";

export function NewItemInput() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [newItem, setNewItem] = useState<string>("");
  const { mutate: createListItem, isPending: isCreatePending } = useCreateListItem();
  const theme = useCurrentTheme();
  const inputRef = useRef<TextInput>(null);

  const handleAddItemPress = () => {
    if (!newItem.trim()) return;

    createListItem(
      { listId: listId, content: newItem.trim() },
      {
        onSuccess: () => {
          setNewItem("");
        },
        onError: (error) => {
          ErrorAlert({
            title: "Failed to create item",
            error,
          });
        },
      },
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <IconSymbol
        name="plus"
        size={30}
        color={!newItem.trim() ? theme.colors.textMuted : theme.colors.icon}
      />
      <Input
        ref={inputRef}
        style={[styles.input]}
        placeholder="New item"
        value={newItem}
        onChangeText={(content) => setNewItem(content)}
        onSubmitEditing={handleAddItemPress}
        submitBehavior="submit"
        editable={!isCreatePending}
        maxLength={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    width: undefined,
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
