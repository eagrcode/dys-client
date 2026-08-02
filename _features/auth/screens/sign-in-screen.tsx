import { ThemedText } from "@/_shared/components/themed-text";
import { ThemedView } from "@/_shared/components/themed-view";
import { Button } from "@/_shared/components/button";
import { ErrorText } from "@/_shared/components/error-text";
import { Input } from "@/_shared/components/input";
import { useAuthProvider } from "@/_features/auth/providers/session-provider";
import { useState, useRef, useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import type { TextInput } from "react-native";
import type { SignInInput } from "@/_features/auth/providers/session-provider";
import { isApiError } from "@/_shared/types/api-error";

function SignInScreen() {
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
  const inputRef = useRef<TextInput>(null);
  const { signIn, sessionErrorMsg, clearSessionErrorMsg } = useAuthProvider();

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
    <ThemedView style={styles.container}>
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
          />
          {renderFieldError("password")}
        </View>
        {renderFormError()}
        <Button variant="primary" onPress={handleSignInPress} disabled={submitDisabled}>
          <ThemedText>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : "Sign In"}
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

export { SignInScreen };
