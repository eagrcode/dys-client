import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { ErrorText } from "@/shared/components/error-text";
import { Input } from "@/shared/components/input";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { RegistrationInput } from "@/features/auth/providers/session-provider";
import { isApiError } from "@/shared/api/api-error";

function RegistrationScreen() {
  const [formData, setFormData] = useState<RegistrationInput>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof RegistrationInput]: string }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { registerUser } = useAuthProvider();

  const submitDisabled =
    isLoading ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.email ||
    !formData.password;

  const handleSetFormData = (key: keyof RegistrationInput, value: string) => {
    // Clear previous errors
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");

    setFormData({ ...formData, [key]: value });
  };

  const handleSignUpPress = async () => {
    setFieldErrors((prev) => ({ ...prev, first_name: "", last_name: "", email: "", password: "" }));
    setFormError("");

    try {
      setIsLoading(true);

      await registerUser(formData);
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (error: unknown) => {
    if (!isApiError(error)) {
      setFormError("An unexpected error occurred. Please try again.");
      return;
    }

    switch (error.code) {
      case "EMAIL_ALREADY_EXISTS":
        setFormError(
          "An account with this email already exists. Please log in or use a different email.",
        );
        break;

      case "VALIDATION_ERROR":
        error.errors?.forEach(({ field, message }) => {
          if (
            field === "first_name" ||
            field === "last_name" ||
            field === "email" ||
            field === "password"
          ) {
            setFieldErrors((prev) => ({ ...prev, [field]: message }));
          }
        });
        break;

      default:
        setFormError(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const renderFieldError = (field: keyof RegistrationInput) => {
    if (fieldErrors[field]) {
      return <ErrorText error={fieldErrors[field]} />;
    }
    return null;
  };

  const renderFormError = () => {
    if (formError) {
      return <ErrorText error={formError} />;
    }
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputs}>
          <Input
            placeholder="First name"
            value={formData.first_name}
            onChangeText={(content) => handleSetFormData("first_name", content)}
            inputMode="text"
            autoComplete="given-name"
            textContentType="givenName"
          />
          {renderFieldError("first_name")}
          <Input
            placeholder="Last name"
            value={formData.last_name}
            onChangeText={(content) => handleSetFormData("last_name", content)}
            inputMode="text"
            autoComplete="family-name"
            textContentType="familyName"
          />
          {renderFieldError("last_name")}
          <Input
            placeholder="Email"
            value={formData.email}
            onChangeText={(content) => handleSetFormData("email", content)}
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            textContentType="emailAddress"
          />
          {renderFieldError("email")}
          <Input
            placeholder="Password"
            value={formData.password}
            onChangeText={(content) => handleSetFormData("password", content)}
            secureTextEntry
            inputMode="text"
            autoComplete="password-new"
            textContentType="password"
          />
          {renderFieldError("password")}
        </View>
        {renderFormError()}
        <Button variant="primary" onPress={handleSignUpPress} disabled={submitDisabled}>
          <ThemedText>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : "Sign Up"}
          </ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  form: {
    width: "100%",
    gap: 16,
  },
  inputs: {
    gap: 8,
  },
});

export { RegistrationScreen };
