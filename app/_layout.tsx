// import "../wdyr";
import { AuthProvider } from "@/_features/auth/providers/session-provider";
import { GroupsProvider } from "@/_features/groups/providers/groups-provider";
import { ThemePreferenceProvider } from "@/_shared/providers/theme-mode-provider";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  Syne_400Regular,
  Syne_500Medium,
  Syne_600SemiBold,
  Syne_700Bold,
  Syne_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/syne";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { shouldRetryApiError } from "@/_shared/types/api-error";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryApiError,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
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
