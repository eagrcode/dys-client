import { StyleSheet } from "react-native";
import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { spacing } from "@/shared/theme/theme";

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="header">Calendar</ThemedText>
      <ThemedText>Coming soon...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing[8],
  },
});
