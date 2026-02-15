import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Family Wall</Text>
        <Text style={styles.subtitle}>Keep your family connected and organized</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.primaryButton} onPress={() => router.push("/(public)/sign-up")}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push("/(public)/sign-in")}>
          <Text style={styles.secondaryButtonText}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  buttons: {
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
