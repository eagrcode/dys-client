import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Dashboard } from "@/components/ui/dashboard";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export default function HomeScreen() {
  const { user } = useAuthProvider();

  const Header = () => {
    const greeting = `Welcome back, ${user?.firstName || "User"}!`;

    return (
      <ThemedText variant="subtitle" style={{ fontSize: 20 }}>
        {greeting}
      </ThemedText>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <Dashboard />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
