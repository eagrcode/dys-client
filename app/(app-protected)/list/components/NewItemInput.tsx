import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/input";
import { useCreateListItem } from "@/hooks/queries/useCreateListItem";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export function NewItemInput() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [newItem, setNewItem] = useState<string>("");
  const { mutate: createListItem } = useCreateListItem();

  const theme = useCurrentTheme();
  const inputRef = useRef<TextInput>(null);

  const handleAddItemPress = () => {
    if (!newItem.trim()) return;

    createListItem({ listId: listId, content: newItem.trim() });
    setNewItem("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgLayer2,
          borderRadius: theme.radius.lg,
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    width: undefined,
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});
