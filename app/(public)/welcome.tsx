import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { Button } from "@/_shared/components/button";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const PILL_CONTENT = ["Lists", "Calendar", "Albums", "Chat"];

export default function Welcome() {
  const router = useRouter();
  const theme = useCurrentTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemedView style={styles.container}>
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

const Pills = () => {
  const theme = useCurrentTheme();

  return (
    <View style={pillStyles.container}>
      {PILL_CONTENT.map((pill) => (
        <View
          key={pill}
          style={[
            pillStyles.pill,
            {
              backgroundColor: theme.colors.bgLayer1,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ThemedText variant="soft">{pill}</ThemedText>
        </View>
      ))}
    </View>
  );
};

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
  },
});

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
});
