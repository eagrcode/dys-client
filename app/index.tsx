import { Redirect } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroups } from "@/hooks/queries/useGroups";

export default function Index() {
  const { user, isLoading: authLoading } = useAuthProvider();

  // Do nothing while Splash Screen is still in effect
  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(public)/welcome" />;
  }

  return <AuthenticatedGate />;
}

function AuthenticatedGate() {
  const { data: userGroups = [], isLoading: userGroupsLoading } = useGroups();

  // Do nothing while Splash Screen is still in effect
  if (userGroupsLoading) {
    return null;
  }

  if (userGroups.length === 0) {
    console.log("AuthenticatedGate | No groups, redirecting to onboarding...");
    return <Redirect href="/(onboarding)/create-group" />;
  }

  console.log("AuthenticatedGate | Has groups, redirecting to home...");
  return <Redirect href="/(app-protected)/(tabs)/home" />;
}
