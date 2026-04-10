import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemedView } from "@/components/themed-view";
import { Colors, Styling } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import { useCreateList } from "@/hooks/queries/useCreateList";
import BackButton from "@/components/ui/back-button";
import { IconSymbol } from "@/components/ui/icon-symbol";

type ListType = "shopping" | "todo" | "other";

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

export default function CreateListModal() {
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ListType>("todo");
  const [items, setItems] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { mutate: createList, isPending: isCreating } = useCreateList();

  const canSubmitWithoutItems = newTitle.trim() && items.length === 0;
  const itemsHasValues = items.some((item) => item.trim() !== "");
  const canSubmitWithItems = newTitle.trim() && items.length > 0 && itemsHasValues;
  const buttonDisabled = !(canSubmitWithoutItems || canSubmitWithItems) || isCreating;

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createList({ title: newTitle.trim(), listType: newType, itemsArr: items });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <ThemedText type="title" style={{ fontSize: 20, letterSpacing: 2 }}>
          New List
        </ThemedText> */}
        <Input
          value={newTitle}
          onChangeText={setNewTitle}
          editable={!isCreating}
          autoFocus={true}
          placeholder={`New ${LIST_TYPE_LABELS[newType]} List`}
          style={{
            borderWidth: 0,
            fontSize: 22,
            fontWeight: "600",
            padding: 0,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderColor: colors.border,
            borderRadius: 0,
          }}
        />
        <BackButton type="close" size={24} />
      </View>

      <View style={styles.content}>
        {/* Form */}
        <View style={styles.form}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["todo", "shopping", "other"] as ListType[]).map((type) => (
              <Pressable
                key={type}
                onPress={() => setNewType(type)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: newType === type ? colors.tint : colors.bgLayer1,
                    borderColor: newType === type ? colors.tint : colors.border,
                  },
                ]}
              >
                <IconSymbol
                  name={LIST_TYPE_ICONS[type] as any}
                  size={20}
                  color={newType === type ? "#fff" : colors.text}
                />
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: newType === type ? "#fff" : colors.text,
                  }}
                >
                  {LIST_TYPE_LABELS[type]}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {/* Item inputs and create button go here */}
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                gap: 8,
                width: "auto",
                // backgroundColor: colors.bgLayer2,
                padding: 12,
                borderRadius: Styling.borderRadiusCTA,
              },
            ]}
            onPress={() => {
              setItems([...items, ""]);
            }}
          >
            <IconSymbol name={"plus"} size={16} color={colors.icon} />
            <ThemedText>Add item</ThemedText>
          </Pressable>
        </View>

        {items.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={styles.itemsContainer}
          >
            {items.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Input
                  placeholder="Description"
                  value={item}
                  onChangeText={(text) => {
                    const newItems = [...items];
                    newItems[index] = text;
                    setItems(newItems);
                  }}
                  editable={!isCreating}
                  style={{
                    flex: 1,
                    padding: 12,
                    // borderLeftColor: colors.tintSoft,
                    // borderLeftWidth: 2,
                    // borderRightColor: colors.tint,
                    // borderRightWidth: 2,
                    borderBottomColor: colors.tintSoft,
                    borderBottomWidth: 2,
                  }}
                />
                <Pressable
                  onPress={() => setItems(items.filter((_, i) => i !== index))}
                  hitSlop={8}
                >
                  <IconSymbol name={"minus"} size={20} color={colors.icon} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        <Button
          variant="primary"
          onPress={handleCreate}
          loading={isCreating}
          disabled={buttonDisabled}
        >
          <ThemedText style={{ color: "#fff" }}>Create List</ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    paddingBottom: 60,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    gap: 16,
  },

  form: {
    gap: 16,
  },

  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
  },

  itemsContainer: {
    flexGrow: 0,
    gap: 8,
  },
});
