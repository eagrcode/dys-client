import { Redirect } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { log } from "@/_shared/logger/logger";
import { useGroupsProvider } from "@/_features/groups/providers/groups-provider";

export default function Index() {
  const { user, isLoading: authLoading } = useAuthProvider();

  // Wait for authentication to finish loading before checking groups
  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(public)/welcome" />;
  }

  log.info("Index | User is authenticated, checking groups...");

  return <AuthenticatedGate />;
}

function AuthenticatedGate() {
  const { data: userGroups, isLoading: userGroupsLoading, isError } = useGroups();
  const { isLoading: selectedGroupLoading } = useGroupsProvider();

  // Wait for both user groups and selected group to load before redirecting
  if (userGroupsLoading || selectedGroupLoading) {
    return null;
  }

  if (isError) {
    return null; // Add error state later
  }

  if (userGroups?.length === 0) {
    log.info("AuthenticatedGate | No groups, redirecting to onboarding...");
    return <Redirect href="/(onboarding)/create-group" />;
  }

  log.info("AuthenticatedGate | Has groups, redirecting to home...");
  return <Redirect href="/(app-protected)/(tabs)/home" />;
}
