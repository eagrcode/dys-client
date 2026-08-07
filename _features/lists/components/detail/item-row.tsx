import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ErrorAlert } from "@/_shared/components/alert";
import { IconSymbol } from "@/_shared/components/icon-symbol";
import { ThemedText } from "@/_shared/components/themed-text";
import { useToggleCompleteListItem } from "@/_features/lists/hooks/use-toggle-complete";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import type { ListItem, ListMode } from "@/_features/lists/lists-types";

type ItemRowProps = {
  item: ListItem;
  listMode: ListMode;
  selectedItemIds: Set<string>;
  setSelectedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function ItemRow({ item, listMode, selectedItemIds, setSelectedItemIds }: ItemRowProps) {
  const theme = useCurrentTheme();

  return (
    <View
      style={[
        itemRowStyles.row,
        {
          backgroundColor: theme.colors.bgLayer2,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
          ...theme.shadow.sm,
        },
      ]}
    >
      <ToggleComplete item={item} listMode={listMode} />
      <ItemContent
        item={item}
        listMode={listMode}
        selectedItemIds={selectedItemIds}
        setSelectedItemIds={setSelectedItemIds}
      />
    </View>
  );
}

function ItemContent({ item, listMode, selectedItemIds, setSelectedItemIds }: ItemRowProps) {
  const theme = useCurrentTheme();
  const router = useRouter();
  const { listId = "" } = useLocalSearchParams<{ listId: string }>();
  const isSelectMode = listMode === "select-items";
  const isSelectedForDelete = selectedItemIds.has(item.id);

  const selectItemForDelete = () => {
    setSelectedItemIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (nextIds.has(item.id)) {
        nextIds.delete(item.id);
      } else {
        nextIds.add(item.id);
      }

      return nextIds;
    });
  };

  const openItemDetails = () => {
    router.push(`/(app-protected)/lists/${listId}/items/${item.id}`);
  };

  return (
    <View style={itemContentStyles.container}>
      {isSelectMode ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={`Select ${item.content}`}
          accessibilityState={{ checked: isSelectedForDelete }}
          onPress={selectItemForDelete}
          style={({ pressed }) => [
            itemContentStyles.selectionTarget,
            { opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <ItemLabel item={item} />
          <IconSymbol
            name={isSelectedForDelete ? "square-r" : "square-ro"}
            color={isSelectedForDelete ? theme.colors.errorText : theme.colors.icon}
            size={20}
          />
        </Pressable>
      ) : (
        <>
          <ItemLabel item={item} />
          <Pressable
            onPress={openItemDetails}
            hitSlop={15}
            style={({ pressed }) => [
              itemContentStyles.navigationButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <IconSymbol name="chevron-right" color={theme.colors.icon} size={20} />
          </Pressable>
        </>
      )}
    </View>
  );
}

function ItemLabel({ item }: { item: ListItem }) {
  return (
    <ThemedText
      style={[itemContentStyles.text, item.completed && itemContentStyles.completedText]}
      numberOfLines={2}
    >
      {item.content}
    </ThemedText>
  );
}

function ToggleComplete({ item, listMode }: { item: ListItem; listMode: ListMode }) {
  const { listId = "" } = useLocalSearchParams<{ listId: string }>();
  const { mutate: toggleCompleteListItem, isPending } = useToggleCompleteListItem();
  const theme = useCurrentTheme();
  const isDisabled = listMode !== "default" || isPending;

  const toggleItem = () => {
    toggleCompleteListItem(
      { listId, itemId: item.id, completed: !item.completed },
      {
        onError: (error) => {
          ErrorAlert({ title: "Failed to toggle item completion", error });
        },
      },
    );
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${item.completed ? "Mark incomplete" : "Mark complete"}: ${item.content}`}
      accessibilityState={{ checked: item.completed, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={toggleItem}
      hitSlop={8}
      style={[toggleStyles.button, { opacity: isDisabled ? 0.5 : 1 }]}
    >
      <IconSymbol
        name={item.completed ? "check-circle" : "circle"}
        size={20}
        color={item.completed ? theme.colors.accent : theme.colors.icon}
      />
    </Pressable>
  );
}

const itemRowStyles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

const itemContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  selectionTarget: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.4,
  },
});

const toggleStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
