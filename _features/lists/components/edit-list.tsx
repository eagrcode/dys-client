import { ThemedText } from "@/_shared/components/themed-text";
import { Button } from "@/_shared/components/button";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { Pressable, StyleSheet, Alert, View } from "react-native";
import { useListById } from "@/_features/lists/hooks/use-list-id";
import { useRenameList } from "@/_features/lists/hooks/use-rename-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useDeleteList } from "@/_features/lists/hooks/use-delete-list";
import { useToggleCompleteAllListItems } from "@/_features/lists/hooks/use-toggle-complete-all";
import type { ListMode } from "@/app/(app-protected)/list/[listId]";
import { useState } from "react";
import { Input } from "@/_shared/components/input";

type Props = {
  listMode: ListMode;
  setListMode: React.Dispatch<React.SetStateAction<ListMode>>;
  setOptionsShowing: React.Dispatch<React.SetStateAction<boolean>>;
};

type OptionsMode = "options" | "rename";

type BuildEditOptions = {
  onRename: () => void;
  onToggleComplete: () => void;
  onToggleSelectMode: () => void;
  onDelete: () => void;
  isCompleted: boolean;
  disabled: boolean;
};

type Options = {
  id: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

const buildEditOptions = ({
  onRename,
  onToggleComplete,
  onToggleSelectMode,
  onDelete,
  isCompleted,
  disabled,
}: BuildEditOptions): Options[] => {
  return [
    {
      id: "rename",
      title: "Rename List",
      onPress: onRename,
    },
    {
      id: "toggle-complete",
      title: isCompleted ? "Mark all incomplete" : "Mark all complete",
      onPress: onToggleComplete,
      disabled: disabled,
    },
    {
      id: "delete-selection",
      title: "Delete Selection",
      onPress: onToggleSelectMode,
      disabled: disabled,
    },
    {
      id: "delete",
      title: "Delete List",
      onPress: onDelete,
      destructive: true,
    },
  ];
};

export default function EditListBottomSheet({ listMode, setListMode, setOptionsShowing }: Props) {
  const [optionsMode, setOptionsMode] = useState<OptionsMode>("options");
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { data: list } = useListById(listId || "");
  const [newTitle, setNewTitle] = useState<string>(list?.title ?? "");
  const { mutate: toggleCompleteAllListItems } = useToggleCompleteAllListItems();
  const { mutate: deleteList, isError } = useDeleteList();
  const { mutate: renameList } = useRenameList();
  const theme = useCurrentTheme();
  const router = useRouter();

  console.log("Options Mode:", optionsMode);

  if (isError) {
    console.log(isError);
  }

  const handleToggleComplete = () => {
    if (!list) return;

    const completed = !list.completed;

    console.log(
      "edit-list.tsx | handleToggleComplete: ",
      `Set all items as completed = ${completed}`,
    );

    toggleCompleteAllListItems({ listId, completed });
  };

  const handleToggleSelectMode = () => {
    if (listMode !== "select-items") {
      setListMode("select-items");
    } else {
      setListMode("default");
    }
    setOptionsShowing(false);
  };

  const handleDelete = () => {
    Alert.alert(`Delete '${list?.title}'`, "List and all items will be removed", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteList(listId, {
            onSuccess: () => {
              router.back();
            },
            onError: (error) => {
              Alert.alert("Could not delete list", "Something went wrong. Please try again.", [
                {
                  text: "Ok",
                  style: "default",
                  onPress: () => {
                    setOptionsShowing(false);
                  },
                },
              ]);
            },
          });
        },
      },
    ]);
  };

  const handleRename = () => {
    setOptionsMode("rename");
  };

  const handleSaveRename = () => {
    renameList({ listId, newTitle });
    setOptionsShowing(false);
  };

  const options: Options[] = buildEditOptions({
    isCompleted: list?.completed ?? false,
    onRename: handleRename,
    onToggleSelectMode: handleToggleSelectMode,
    onToggleComplete: handleToggleComplete,
    onDelete: handleDelete,
    disabled: (list?.items && list.items.length === 0) ?? false,
  });

  const renderOptions = () => {
    return options.map((option) => (
      <Button
        key={option.id}
        variant="secondaryFill2"
        onPress={option.onPress}
        style={{ width: "100%" }}
        disabled={option.disabled}
      >
        <ThemedText style={{ color: option.destructive ? "red" : theme.colors.text }}>
          {option.title}
        </ThemedText>
      </Button>
    ));
  };

  const renderRename = () => {
    return (
      <View>
        <Input
          style={{ borderWidth: 2, padding: 12 }}
          placeholder="New list name"
          value={newTitle}
          onChangeText={(text) => setNewTitle(text)}
          autoFocus
        />
        <View style={{ height: 16 }} />
        <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
          <Button
            variant="secondaryFill2"
            onPress={handleSaveRename}
            style={{ flex: 1, padding: 12 }}
          >
            <ThemedText style={{ color: theme.colors.accent }}>Save</ThemedText>
          </Button>
          <Button
            variant="secondary"
            onPress={() => {
              setOptionsMode("options");
              setOptionsShowing(false);
            }}
            style={{ flex: 1, padding: 12 }}
          >
            <ThemedText style={{ color: theme.colors.text }}>Cancel</ThemedText>
          </Button>
        </View>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeIn.duration(120)} style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setOptionsShowing(false)} />
      <Animated.View
        entering={SlideInDown.duration(200)}
        style={[styles.container, { backgroundColor: theme.colors.bgLayer1 }]}
      >
        {optionsMode === "options" ? renderOptions() : renderRename()}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
