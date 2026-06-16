import { View, StyleSheet, TextInput, ViewStyle, StyleProp } from "react-native";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { IconSymbol } from "./icon-symbol.ios";
import { useRef, useState } from "react";
import { Input } from "./input";

type Props = {
  handleAddItemPress: (item: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function AddListItem({ handleAddItemPress, style }: Props) {
  const [newItem, setNewItem] = useState<string>("");

  const inputRef = useRef<TextInput>(null);

  const theme = useCurrentTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      <IconSymbol
        name="plus"
        size={30}
        color={!newItem.trim() ? theme.colors.textMuted : theme.colors.icon}
      />
      <Input
        ref={inputRef}
        style={styles.input}
        placeholder="New item"
        value={newItem}
        onChangeText={(content) => setNewItem(content)}
        onSubmitEditing={() => {
          handleAddItemPress(newItem.trim());
          setNewItem("");
        }}
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
    borderWidth: 0,
  },
  input: {
    flex: 1,
    width: undefined,
    borderWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
});
