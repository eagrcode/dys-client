import { StyleSheet } from "react-native";
import { ThemedView } from "@/_shared/components/themed-view";
import { Summary } from "@/_features/dashboard/components/summary";
import { Header } from "@/_features/dashboard/components/header";
import { useGroupById } from "@/_features/groups/hooks/use-group-id";

function HomeScreen() {
  useGroupById();

  return (
    <ThemedView style={styles.container}>
      <Header />
      <Summary />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
});

export default HomeScreen;
