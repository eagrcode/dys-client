import { View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { Button } from "./button";
import { useCurrentTheme } from "@/_shared/hooks/use-current-theme";
import type { ApiError } from "@/_shared/types/api-error";

type Props = {
  error: ApiError | null;
  refetch: () => void;
  isFetching: boolean;
  type: string;
};

const RetryFetch = ({ error, refetch, isFetching, type }: Props) => {
  const theme = useCurrentTheme();
  const isNotFound = error?.status === 404;
  const isNetworkError = error?.code === "NETWORK_ERROR";
  const isServerError = typeof error?.status === "number" && error.status >= 500;
  const isInvalidResponse = error?.code === "INVALID_RESPONSE";
  const canRetry = isNetworkError || isServerError || isInvalidResponse;

  let message = error?.message || `Unable to load ${type}.`;

  if (isNotFound) {
    message = `The requested ${type} could not be found.`;
  } else if (isNetworkError) {
    message = `Unable to connect to the server while loading ${type}.`;
  } else if (isServerError || isInvalidResponse) {
    message = `The server could not load ${type}.`;
  }

  return (
    <View style={styles.centered}>
      <ThemedText style={{ opacity: 0.5, marginBottom: 16 }}>
        {message}
      </ThemedText>
      {canRetry && (
        <Button
          variant="primary"
          style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: theme.radius.sm }}
          onPress={() => void refetch()}
          loading={isFetching}
          disabled={isFetching}
        >
          <ThemedText variant="button" style={{ color: "#fff" }}>
            {isFetching ? "Retrying..." : "Retry"}
          </ThemedText>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RetryFetch;
