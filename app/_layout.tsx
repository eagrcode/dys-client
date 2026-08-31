// import "../wdyr";
import {
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  useFonts,
} from "@expo-google-fonts/hanken-grotesk";
import { AuthProvider } from "@/features/auth/providers/session-provider";
import { GroupsProvider } from "@/features/groups/providers/groups-provider";
import { ThemePreferenceProvider } from "@/shared/providers/theme-mode-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { shouldRetryApiError } from "@/shared/api/api-error";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: shouldRetryApiError,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemePreferenceProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GroupsProvider>
              <StatusBar style="auto" />
              <Slot />
            </GroupsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemePreferenceProvider>
    </GestureHandlerRootView>
  );
}
