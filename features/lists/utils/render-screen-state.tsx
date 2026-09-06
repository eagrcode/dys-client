import { ApiError } from "@/shared/api/api-error";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { RetryFetch } from "@/shared/components/retry-fetch";
import { ThemedText } from "@/shared/components/themed-text";

type Props = {
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetch: () => void;
  isEmpty: boolean;
  isEmptyMessage: string;
  type: string;
};

type ScreenStateResult = React.ReactNode | null;

export const renderScreenState = ({
  isPending,
  isError,
  isFetching,
  error,
  refetch,
  isEmpty,
  isEmptyMessage,
  type,
}: Props): ScreenStateResult => {
  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <RetryFetch error={error} refetch={refetch} isFetching={isFetching} type={type} />;
  }

  if (isEmpty) {
    return <EmptyState message={isEmptyMessage} />;
  }

  return null;
};

function LoadingState() {
  const { colors } = useCurrentTheme();

  return (
    <View style={styles.centered}>
      <ActivityIndicator
        style={{ transform: [{ scale: 1.2 }] }}
        size="small"
        color={colors.accent.primary}
      />
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.centered}>
      <ThemedText style={{ opacity: 0.5 }}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
