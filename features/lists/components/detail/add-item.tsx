import { Icon } from "@/shared/components/icon";
import { Input } from "@/shared/components/input";
import { useCreateListItem } from "@/features/lists/mutations/use-create-list-item";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { ErrorAlert } from "@/shared/components/alert";

type Props = {
  listId: string;
};

export function AddItem({ listId }: Props) {
  const [newItem, setNewItem] = useState<string>("");
  const { mutate: createListItem } = useCreateListItem();
  const { colors } = useCurrentTheme();
  const inputRef = useRef<TextInput>(null);

  const handleAddItemPress = () => {
    if (!newItem.trim()) return;

    createListItem(
      { listId: listId, content: newItem.trim() },
      {
        onError: (error) => {
          ErrorAlert({
            title: "Failed to create item",
            error,
          });
        },
      },
    );
    setNewItem("");
  };

  return (
    <Input
      ref={inputRef}
      leftIcon={
        <Icon
          name="plus"
          size={22}
          color={!newItem.trim() ? colors.textMuted : colors.icon}
          weight="bold"
        />
      }
      paddingHorizontal="lg"
      paddingVertical="md"
      placeholder="New item"
      value={newItem}
      onChangeText={setNewItem}
      onSubmitEditing={handleAddItemPress}
      submitBehavior="submit"
      maxLength={100}
      autoCapitalize="sentences"
      borderThickness="hairline"
      radius="sm"
    />
  );
}
