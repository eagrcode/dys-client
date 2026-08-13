import { ThemedText } from "@/_shared/components/themed-text";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { useDeleteListItems } from "@/_features/lists/hooks/use-delete-list-items";
import { useLocalSearchParams } from "expo-router";
import type { ListMode } from "@/_features/lists/types/t-list-ui";
import { ErrorAlert } from "@/_shared/components/alert";

type Props = {
  selectedItemIds: Set<string>;
  setSelectedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
};

type BtnOptions = {
  text: string;
  isDestructive: boolean;
  onPress: () => void;
};

type BuildBtnOptions = {
  onDeletePress: () => void;
  onCancelPress: () => void;
};

const buildBtnOptions = ({ onDeletePress, onCancelPress }: BuildBtnOptions): BtnOptions[] => {
  return [
    {
      text: "Delete",
      isDestructive: true,
      onPress: onDeletePress,
    },
    {
      text: "Cancel",
      isDestructive: false,
      onPress: onCancelPress,
    },
  ];
};

export function DeleteItemsToolbar({ selectedItemIds, setSelectedItemIds, setListMode }: Props) {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const theme = useCurrentTheme();
  const { mutate: deleteListItems, isPending: isDeletePending } = useDeleteListItems();

  const resetSelectedItemIds = () => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.clear();
      return newSet;
    });
  };

  const resetDeleteState = () => {
    resetSelectedItemIds();
    setListMode("default");
  };

  const onCancelPress = () => {
    resetDeleteState();
  };

  const onDeletePress = () => {
    console.log("DeleteItemsToolbar.tsx | onDeletePress:", {
      selectedItemIds: [...selectedItemIds],
    });

    deleteListItems(
      { listId, itemIds: [...selectedItemIds] },
      {
        onSuccess: () => {
          resetDeleteState();
        },
        onError: (error) => {
          ErrorAlert({
            title: "Failed to delete items",
            error,
          });
        },
      },
    );
  };

  const btnOptions: BtnOptions[] = buildBtnOptions({ onDeletePress, onCancelPress });

  return (
    <View style={deleteItemsBtnStyles.container}>
      {btnOptions.map((btn) => (
        <Pressable
          key={btn.text}
          style={({ pressed }) => [
            deleteItemsBtnStyles.btn,
            {
              backgroundColor: theme.colors.bgLayer3,
              borderRadius: theme.radius.full,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          onPress={btn.onPress}
          disabled={btn.isDestructive && (selectedItemIds.size === 0 || isDeletePending)}
        >
          <ThemedText
            style={{ color: btn.isDestructive ? theme.colors.danger : theme.colors.text }}
          >
            {btn.text}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const deleteItemsBtnStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    marginHorizontal: 16,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
