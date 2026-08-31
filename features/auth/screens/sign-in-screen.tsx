import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { ErrorText } from "@/shared/components/error-text";
import { Input } from "@/shared/components/input";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useState, useRef, useEffect } from "react";
import { isApiError } from "@/shared/api/api-error";
import { spacing } from "@/shared/theme/theme";
import { BackButton } from "@/shared/components/back-button";
import type { TextInput } from "react-native";
import type { SignInInput } from "@/features/auth/providers/session-provider";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";

export function SignInScreen() {
  const theme = useCurrentTheme();
  const [formData, setFormData] = useState<SignInInput>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof SignInInput]: string }>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn, sessionErrorMsg, clearSessionErrorMsg } = useAuthProvider();
  const inputRef = useRef<TextInput>(null);

  const submitDisabled = isLoading || !formData.email || !formData.password;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (sessionErrorMsg) {
      Alert.alert("Session Expired", sessionErrorMsg, [
        {
          text: "OK",
          onPress: () => clearSessionErrorMsg(),
        },
      ]);
    }
    return () => {
      clearSessionErrorMsg();
    };
  }, [sessionErrorMsg, clearSessionErrorMsg]);

  const handleSetFormData = (key: keyof SignInInput, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");

    setFormData({ ...formData, [key]: value });
  };

  const handleSignInPress = async () => {
    setFieldErrors({ email: "", password: "" });
    setFormError("");

    try {
      setIsLoading(true);
      await signIn(formData);
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (error: unknown) => {
    if (!isApiError(error)) {
      console.log("SignIn | Unexpected error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      return;
    }

    if (error.code === "LIMIT_EXCEEDED") {
      setFormError("Too many failed attempts. Please try again later.");
    } else if (error.code === "UNAUTHORISED") {
      setFormError("Invalid email or password.");
    } else if (error.code === "VALIDATION_ERROR") {
      error.errors?.forEach(({ field, message }) => {
        if (field === "email" || field === "password") {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        }
      });
    } else {
      console.log("SignIn | Unexpected error:", error);
      setFormError(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const renderFieldError = (field: keyof SignInInput) => {
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
      <ThemedView header={<BackButton type={"left"} />}>
        <ThemedText variant="headerLg">Welcome back! 👋</ThemedText>
        <ThemedText variant="body">Sign in to continue</ThemedText>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <Input
              placeholder="Email"
              value={formData.email}
              onChangeText={(content) => handleSetFormData("email", content)}
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
              textContentType="emailAddress"
              ref={inputRef}
              paddingHorizontal="lg"
              paddingVertical="md"
              radius="sm"
              autoCapitalize="none"
            />
            {renderFieldError("email")}
            <Input
              placeholder="Password"
              value={formData.password}
              onChangeText={(content) => handleSetFormData("password", content)}
              secureTextEntry
              inputMode="text"
              autoComplete="password"
              textContentType="password"
              paddingHorizontal="lg"
              paddingVertical="md"
              radius="sm"
              autoCapitalize="none"
            />
            {renderFieldError("password")}
          </View>
          {renderFormError()}
          <Button variant="primary" onPress={handleSignInPress} disabled={submitDisabled}>
            <ThemedText variant="button" style={{ color: theme.colors.onAccent }}>
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.onAccent} />
              ) : (
                "Sign In"
              )}
            </ThemedText>
          </Button>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    gap: spacing[16],
  },
  inputs: {
    gap: spacing[8],
  },
});
