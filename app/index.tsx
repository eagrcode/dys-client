import { Redirect } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { View, ActivityIndicator } from "react-native";
import { useGroups } from "@/hooks/queries/useGroups";
import { useGroupById } from "@/hooks/queries/useGroupById";

export default function Index() {
  const { user, isLoading: authLoading } = useAuthProvider();
  const { selectedGroup, switchGroup } = useGroupsProvider();
  const { data: groups, isLoading: groupsLoading, isFetching: groupsFetching } = useGroups();
  const { data: groupDetails, isLoading: groupDetailsLoading } = useGroupById(
    selectedGroup?.id || "",
  );

  // Show loading while checking auth and groups
  if (authLoading || groupsFetching) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not authenticated - show welcome screen
  if (!user) {
    return <Redirect href="/(public)/welcome" />;
  }

  // Authenticated but no groups - go to group setup
  if (groups.length === 0) {
    return <Redirect href="/(onboarding)/create-group" />;
  }

  // Has groups - go to main app
  return <Redirect href="/(app-protected)/(tabs)/home" />;
}
