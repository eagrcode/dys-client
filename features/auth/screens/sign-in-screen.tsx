import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { Button } from "@/shared/components/button";
import { ErrorText } from "@/shared/components/error-text";
import { Input } from "@/shared/components/input";
import { useAuthProvider } from "@/features/auth/providers/session-provider";
import { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { isApiError } from "@/shared/api/api-error";
import type { TextInput } from "react-native";
import type { SignInInput } from "@/features/auth/providers/session-provider";

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
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={styles.container}>
        <ThemedText variant="title" style={{ marginBottom: 16, fontSize: 22 }}>
          Welcome back! 👋
        </ThemedText>
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
            <ThemedText variant="button">
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : "Sign In"}
            </ThemedText>
          </Button>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
