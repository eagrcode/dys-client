import { Redirect } from "expo-router";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useGroups } from "@/hooks/queries/useGroups";

export default function Index() {
  const { user, isLoading: authLoading } = useAuthProvider();

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

  if (userGroupsLoading) {
    return null;
  }

  if (userGroups.length === 0) {
    return <Redirect href="/(onboarding)/create-group" />;
  }

  return <Redirect href="/(app-protected)/(tabs)/home" />;
}
