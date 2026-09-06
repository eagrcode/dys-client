import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
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
import React, { useState, useRef, useEffect } from "react";
import { isApiError } from "@/shared/api/api-error";
import { spacing } from "@/shared/theme/theme";
import { BackButton } from "@/shared/components/back-button";
import type { TextInput, TextInputProps } from "react-native";
import type { SignInInput } from "@/features/auth/providers/session-provider";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { Icon } from "@/shared/components/icon";
import { Link } from "expo-router";

type InputField = {
  key: keyof SignInInput;
  placeholder: string;
  inputMode: "text" | "email";
  textContentType: TextInputProps["textContentType"];
  value: string;
  onChange: (value: string) => void | undefined;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  keyboardType?: TextInputProps["keyboardType"];
  icon?: React.ReactNode;
};

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signIn, sessionErrorMsg, clearSessionErrorMsg } = useAuthProvider();
  const inputRef = useRef<TextInput>(null);

  const submitDisabled = isLoading || !formData.email || !formData.password;

  const inputs: InputField[] = [
    {
      key: "email",
      placeholder: "Email",
      inputMode: "email",
      textContentType: "emailAddress",
      value: formData.email,
      onChange: (value) => handleSetFormData("email", value),
      autoCapitalize: "none",
      autoComplete: "email",
      keyboardType: "email-address",
    },
    {
      key: "password",
      placeholder: "Password",
      inputMode: "text",
      textContentType: "password",
      value: formData.password,
      onChange: (value) => handleSetFormData("password", value),
      autoCapitalize: "none",
      autoComplete: "password",
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
      <ThemedView header={<Header />}>
        <View style={styles.container}>
          <ThemedText variant="body">Sign in to continue</ThemedText>
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
                  autoComplete,
                  keyboardType,
                }) => (
                  <React.Fragment key={key}>
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                      inputMode={inputMode}
                      textContentType={textContentType}
                      autoCapitalize={autoCapitalize}
                      autoComplete={autoComplete}
                      keyboardType={keyboardType}
                      ref={key === "email" ? inputRef : undefined}
                      secureTextEntry={key === "password" && !showPassword}
                      rightIcon={icon}
                    />
                    {renderFieldError(key)}
                  </React.Fragment>
                ),
              )}
            </View>
            {renderFormError()}
            <Button variant="primary" onPress={handleSignInPress} disabled={submitDisabled}>
              <ThemedText variant="button" style={{ color: theme.colors.text.onAccent }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.text.onAccent} />
                ) : (
                  "Sign in"
                )}
              </ThemedText>
            </Button>
          </View>
        </View>
        <ThemedText style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link
            href="/(public)/sign-up"
            replace
            style={{ color: theme.colors.accent.primary, textDecorationLine: "underline" }}
          >
            Sign up
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
      <ThemedText variant="header">Welcome back!</ThemedText>
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
