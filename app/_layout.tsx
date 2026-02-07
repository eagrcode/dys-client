import "react-native-reanimated";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/lib/context/SessionProvider";
import { GroupsProvider } from "@/lib/context/GroupsProvider";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GroupsProvider>
            <StatusBar style="auto" />
            <Slot />
          </GroupsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
