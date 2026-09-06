import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { ErrorText } from "@/shared/components/error-text";
import { Input } from "@/shared/components/input";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type TextInputProps,
} from "react-native";
import type { RegistrationInput } from "@/features/auth/providers/session-provider";
import { isApiError } from "@/shared/api/api-error";
import { BackButton } from "@/shared/components/back-button";
import { spacing } from "@/shared/theme/theme";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import React from "react";
import { Icon } from "@/shared/components/icon";
import { Link } from "expo-router";

type InputField = {
  key: keyof RegistrationInput;
  placeholder: string;
  inputMode: "text" | "email";
  textContentType: TextInputProps["textContentType"];
  value: string;
  onChange: (value: string) => void | undefined;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  icon?: React.ReactNode;
};

export function RegistrationScreen() {
  const { colors } = useCurrentTheme();
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { registerUser } = useAuthProvider();

  const submitDisabled =
    isLoading ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.email ||
    !formData.password;

  const inputs: InputField[] = [
    {
      key: "first_name",
      placeholder: "First name",
      inputMode: "text",
      textContentType: "givenName",
      value: formData.first_name,
      onChange: (value) => handleSetFormData("first_name", value),
      autoCapitalize: "words",
    },
    {
      key: "last_name",
      placeholder: "Last name",
      inputMode: "text",
      textContentType: "familyName",
      value: formData.last_name,
      onChange: (value) => handleSetFormData("last_name", value),
      autoCapitalize: "words",
    },
    {
      key: "email",
      placeholder: "Email",
      inputMode: "email",
      textContentType: "emailAddress",
      value: formData.email,
      onChange: (value) => handleSetFormData("email", value),
      autoCapitalize: "none",
    },
    {
      key: "password",
      placeholder: "Password",
      inputMode: "text",
      textContentType: "newPassword",
      value: formData.password,
      onChange: (value) => handleSetFormData("password", value),
      autoCapitalize: "none",
      icon: (
        <Pressable onPress={() => setShowPassword((prev) => !prev)}>
          <Icon
            name={showPassword ? "eye-slash" : "eye"}
            weight={showPassword ? "normal" : "thin"}
          />
        </Pressable>
      ),
    },
  ];

  const handleSetFormData = (key: keyof RegistrationInput, value: string) => {
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
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView header={<Header />}>
        <View style={styles.container}>
          <ThemedText>Enter your details to get started</ThemedText>
          <View style={styles.form}>
            <View style={styles.inputs}>
              {inputs.map(
                ({
                  key,
                  placeholder,
                  value,
                  onChange,
                  icon,
                  inputMode,
                  textContentType,
                  autoCapitalize,
                }) => (
                  <React.Fragment key={key}>
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                      inputMode={inputMode}
                      textContentType={textContentType}
                      autoCapitalize={autoCapitalize}
                      secureTextEntry={key === "password" && !showPassword}
                      rightIcon={icon}
                    />
                    {renderFieldError(key)}
                  </React.Fragment>
                ),
              )}
            </View>
            {renderFormError()}
            <Button variant="primary" onPress={handleSignUpPress} disabled={submitDisabled}>
              <ThemedText variant="button" style={{ color: colors.text.onAccent }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.text.onAccent} />
                ) : (
                  "Sign up"
                )}
              </ThemedText>
            </Button>
          </View>
        </View>
        <ThemedText style={styles.footer}>
          Already have an account?{" "}
          <Link
            href="/(public)/sign-in"
            replace
            style={{ color: colors.accent.primary, textDecorationLine: "underline" }}
          >
            Sign in
          </Link>
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

function Header() {
  return (
    <View style={headerStyles.container}>
      <BackButton type={"left"} />
      <ThemedText variant="header">Create an account</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[8],
  },
  form: {
    width: "100%",
    gap: spacing[16],
  },
  inputs: {
    gap: spacing[8],
  },
  footer: {
    textAlign: "center",
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing[8],
  },
});
