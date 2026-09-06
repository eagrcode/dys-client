import { Redirect } from "expo-router";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useGroups } from "@/features/groups/queries/use-groups";
import { log } from "@/shared/logging/logger";
import { useGroupsProvider } from "@/features/groups/providers/groups-provider";
import { RetryFetch } from "@/shared/components/retry-fetch";
import { ThemedView } from "@/shared/components/themed-view";
import { LoadingScreen } from "@/shared/components/loading-screen";
import type { ApiError } from "@/shared/api/api-error";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

type StartupErrorProps = {
  error: ApiError | null;
  refetch: () => void;
  isFetching: boolean;
};

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
  const {
    data: userGroups,
    isLoading: userGroupsLoading,
    isError,
    error,
    refetch,
    isFetching,
    errorUpdatedAt,
  } = useGroups();
  const { isLoading: selectedGroupLoading } = useGroupsProvider();
  const hasGroupsFailed = errorUpdatedAt > 0;

  // Wait for both user groups and selected group to load before redirecting
  if (userGroupsLoading || selectedGroupLoading) {
    return hasGroupsFailed ? <LoadingScreen /> : null;
  }

  if (isError) {
    return <StartupError error={error} refetch={refetch} isFetching={isFetching} />;
  }

  if (userGroups?.length === 0) {
    log.info("AuthenticatedGate | No groups, redirecting to onboarding...");
    return <Redirect href="/(onboarding)/create-group" />;
  }

  log.info("AuthenticatedGate | Has groups, redirecting to home...");
  return <Redirect href="/(app-protected)/(tabs)/home" />;
}

function StartupError({ error, refetch, isFetching }: StartupErrorProps) {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemedView>
      <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type="groups" />
    </ThemedView>
  );
}
