import { ThemedView } from "@/components/themed-view";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Styling } from "@/constants/theme";
import { ErrorText } from "@/components/ui/error-text";

type FormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof FormData]: string }>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn } = useAuthProvider();

  const submitDisabled = isLoading || !formData.email || !formData.password;

  const handleSetFormData = (key: keyof FormData, value: string) => {
    // Clear previous errors
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");

    setFormData({ ...formData, [key]: value });
  };

  const handleSignInPress = async () => {
    // Clear previous errors
    setFieldErrors({ email: "", password: "" });
    setFormError("");

    try {
      setIsLoading(true);
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (error: any) => {
    const code = error?.code;

    if (code === "LIMIT_EXCEEDED") {
      setFormError("Too many failed attempts. Please try again later.");
    } else if (code === "UNAUTHORISED") {
      setFormError("Invalid email or password.");
    } else if (code === "VALIDATION_ERROR") {
      const validationErrors = error?.errors;
      validationErrors.forEach((fieldError: any) => {
        const field = fieldError?.path;
        const message = fieldError?.msg;
        if (field && message) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
        }
      });
    } else {
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  const renderFieldError = (field: keyof FormData) => {
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
