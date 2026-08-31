import { Alert } from "react-native";
import type { ApiError } from "../api/api-error";

type Props = {
  title: string;
  error: ApiError;
};

export const ErrorAlert = ({ title, error }: Props) => {
  const validationMessage = error.errors
    ?.map(({ field, message }) => `${field.replaceAll("_", " ")}: ${message}`)
    .join("\n");

  return Alert.alert(
    title,
    validationMessage || error.message || "An unexpected error occurred. Please try again.",
  );
};
