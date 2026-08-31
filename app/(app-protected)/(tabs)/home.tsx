import { StyleSheet } from "react-native";
import { ThemedView } from "@/shared/components/themed-view";
import { Summary } from "@/features/dashboard/components/summary";
import { Header } from "@/features/dashboard/components/header";
import { useGroupById } from "@/features/groups/queries/use-group-id";
import { useGroupMembers } from "@/features/members/queries/use-group-members";

function HomeScreen() {
  useGroupById();
  useGroupMembers();

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
