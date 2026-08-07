import { Stack } from "expo-router";
import { SocketProvider } from "@/_shared/realtime/socket-provider";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";

export default function AppProtectedLayout() {
  const theme = useCurrentTheme();

  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="modals/group-actions"
          options={{
            presentation: "formSheet",
            gestureEnabled: true,
            sheetAllowedDetents: "fitToContents",
            sheetGrabberVisible: true,
            sheetCornerRadius: 30,
            contentStyle: { backgroundColor: theme.colors.bgLayer1 },
          }}
        />
      </Stack>
    </SocketProvider>
  );
}
