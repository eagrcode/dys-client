import { ThemedView } from "@/components/themed-view";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiCall } from "@/utils/apiCall";
import { Styling } from "@/constants/theme";
import { ErrorText } from "@/components/ui/error-text";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof FormData]: string }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn } = useAuthProvider();

  const submitDisabled =
    isLoading ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.email ||
    !formData.password;

  const handleSetFormData = (key: keyof FormData, value: string) => {
    // Clear previous errors
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");

    setFormData({ ...formData, [key]: value });
  };

  const handleSignUpPress = async () => {
    // Clear previous errors
    setFieldErrors({ first_name: "", last_name: "", email: "", password: "" });
    setFormError("");

    try {
      setIsLoading(true);
      await apiCall("/auth/register", "POST", {
        body: JSON.stringify(formData),
      });
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
      setFormError("Too many attempts. Please try again later.");
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
      setFormError(error?.message || "An unexpected error occurred. Please try again.");
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
        <Button
          variant="primary"
          onPress={handleSignUpPress}
          disabled={submitDisabled}
          style={{ borderRadius: Styling.borderRadiusCTA }}
        >
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
