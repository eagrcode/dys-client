import { Redirect } from "expo-router";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useGroups } from "@/_features/groups/hooks/use-groups";
import { log } from "@/_shared/logger/logger";

export default function Index() {
  const { user, isLoading: authLoading } = useAuthProvider();

  // Do nothing while Splash Screen is still in effect
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
  const { data: userGroups, isLoading, isError, isSuccess } = useGroups();

  // Do nothing while Splash Screen is still in effect
  if (isLoading) {
    return null;
  }

  if (isError) {
    return null; // Add error state later
  }

  if (isSuccess && userGroups?.length === 0) {
    log.info("AuthenticatedGate | No groups, redirecting to onboarding...");
    return <Redirect href="/(onboarding)/create-group" />;
  }

  log.info("AuthenticatedGate | Has groups, redirecting to home...");
  return <Redirect href="/(app-protected)/(tabs)/home" />;
}
