import { useAuthProvider } from "@/_features/auth/providers/session-provider";

export function useGroupKeys() {
  const { user } = useAuthProvider();

  const groupKeys = {
    all: () => ["groups", user?.id] as const,
    detail: (groupId: string) => ["groups", user?.id, groupId] as const,
  };

  return groupKeys;
}
