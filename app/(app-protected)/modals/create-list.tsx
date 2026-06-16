import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemedView } from "@/components/themed-view";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useCreateList } from "@/hooks/queries/useCreateList";
import { BackButton } from "@/components/ui/back-button";
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

const LIST_TYPE_ARR: ListType[] = ["shopping", "todo", "other"];

export default function CreateListModal() {
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ListType>("todo");

  const theme = useCurrentTheme();

  const { mutate: createList, isPending: isCreating } = useCreateList();

  const canSubmit = newTitle.trim().length > 0;
  const buttonDisabled = !canSubmit || isCreating;
  const titleText = `New ${LIST_TYPE_LABELS[newType]} List`;

  const keyboard = useAnimatedKeyboard();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 5 }],
  }));

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createList({ title: newTitle.trim(), listType: newType });
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton type="close" size={24} style={{ position: "absolute", top: 60, right: 16 }} />

      <Animated.View style={animatedStyle}>
        <View style={{ gap: 16 }}>
          <View style={[styles.form, { backgroundColor: theme.colors.background }]}>
            {/* Form Header */}
            <View style={styles.formHeader}>
              <ThemedText variant="title" style={styles.formTitle}>
                {titleText}
              </ThemedText>
              <IconSymbol
                name={LIST_TYPE_ICONS[newType] as any}
                size={25}
                color={theme.colors.text}
              />
            </View>

            {/* Title Input */}
            <Input
              value={newTitle}
              onChangeText={setNewTitle}
              editable={!isCreating}
              autoFocus={true}
              placeholder={`Title`}
              style={{ padding: 12 }}
            />

            {/* List Type Selector */}
            <View style={styles.pillContainer}>
              {LIST_TYPE_ARR.map((type) => (
                <Pressable key={type} onPress={() => setNewType(type)} style={styles.pill}>
                  <IconSymbol
                    name={LIST_TYPE_ICONS[type] as any}
                    size={20}
                    color={newType === type ? theme.colors.accent : theme.colors.textMuted}
                  />
                  <ThemedText
                    variant="defaultSemiBold"
                    style={{
                      color: newType === type ? theme.colors.accent : theme.colors.textMuted,
                    }}
                  >
                    {LIST_TYPE_LABELS[type]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <Button
            variant="primary"
            onPress={handleCreate}
            loading={isCreating}
            disabled={buttonDisabled}
            style={{ borderRadius: 15 }}
          >
            <ThemedText>Create List</ThemedText>
          </Button>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    padding: 16,
    paddingTop: 60,
    paddingBottom: 60,
    gap: 16,
    justifyContent: "center",
  },

  form: {
    gap: 16,
    padding: 16,
    borderRadius: 8,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  formTitle: { fontSize: 20, letterSpacing: 2 },

  pillContainer: { flexDirection: "row", gap: 8 },

  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
});
