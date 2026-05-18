import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AccentGlow } from "@/components/accent-glow";

export default function Welcome() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  function Pills() {
    const content = ["Lists", "Calendar", "Albums", "Chat"];

    return (
      <View style={{ flexDirection: "row", gap: 8 }}>
        {content.map((pill) => (
          <View
            key={pill}
            style={{
              backgroundColor: theme.colors.bgLayer1,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <ThemedText variant="soft">{pill}</ThemedText>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <AccentGlow />
      <View style={styles.content}>
        <ThemedText variant="title" style={[styles.title, { color: theme.colors.accent }]}>
          HearthLink
        </ThemedText>

        <ThemedText variant="soft" style={styles.tagline}>
          For couples, households, and the groups that matter most.
        </ThemedText>

        <Pills />
      </View>

      <View style={styles.buttons}>
        <Button variant="primary" onPress={() => router.push("/(public)/sign-up")}>
          <ThemedText variant="button">Create Account</ThemedText>
        </Button>

        <Button variant="secondary" onPress={() => router.push("/(public)/sign-in")}>
          <ThemedText variant="button" style={{ color: theme.colors.text }}>
            Log In
          </ThemedText>
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
    gap: 16,
    maxWidth: "90%",
    textAlign: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 45,
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
  },
  buttons: {
    gap: 16,
    marginBottom: 40,
  },
});
