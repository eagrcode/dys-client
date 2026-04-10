import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Welcome() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={[styles.title, { color: Colors[colorScheme].tint }]}>
          HEARTHLINK
        </ThemedText>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Keep your family connected and organized
        </ThemedText>
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={() => router.push("/(public)/sign-up")}>
          <ThemedText type="button">Create Account</ThemedText>
        </Button>

        <Button variant="secondary" onPress={() => router.push("/(public)/sign-in")}>
          <ThemedText style={{ color: Colors[colorScheme].tint }}>Log In</ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 50,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
  },
  buttons: {
    gap: 8,
    marginBottom: 40,
  },
});
