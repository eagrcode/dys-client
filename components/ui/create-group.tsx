import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorText } from "@/components/ui/error-text";
import React, { useState } from "react";
import { useCreateGroup } from "@/hooks/queries/useCreateGroup";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";

type FormData = {
  name: string;
  description: string;
};

const CreateGroup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof FormData]: string }>({
    name: "",
    description: "",
  });
  const [formError, setFormError] = useState<string>("");

  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();

  const theme = useCurrentTheme();

  const submitDisabled = isCreating || !formData.name || !formData.description;

  const keyboard = useAnimatedKeyboard();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 5 }],
  }));

  const handleSetFormData = (key: keyof FormData, value: string) => {
    // Clear previous errors
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");

    setFormData({ ...formData, [key]: value });
  };

  const handleCreateGroupPress = async () => {
    // Clear previous errors
    setFieldErrors({ name: "", description: "" });
    setFormError("");

    try {
      await createGroup({ name: formData.name, description: formData.description });
    } catch (error: any) {
      handleErrors(error);
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
      <Animated.View style={animatedStyle}>
        <View style={[styles.form, { backgroundColor: theme.colors.background }]}>
          <ThemedText variant="subtitle" style={{ fontSize: 20, letterSpacing: 2 }}>
            Create a Group
          </ThemedText>
          <View style={styles.inputs}>
            <Input
              placeholder="Name"
              value={formData.name}
              onChangeText={(content) => handleSetFormData("name", content)}
              inputMode="text"
              editable={!isCreating}
            />
            {renderFieldError("name")}
            <Input
              placeholder="Description"
              value={formData.description}
              onChangeText={(content) => handleSetFormData("description", content)}
              inputMode="text"
              editable={!isCreating}
            />
            {renderFieldError("description")}
          </View>
          {renderFormError()}
          <Button
            variant="primary"
            style={{ borderRadius: theme.radius.md }}
            onPress={handleCreateGroupPress}
            disabled={submitDisabled}
            loading={isCreating}
          >
            <ThemedText variant="defaultSemiBold" style={{ color: "#fff" }}>
              Submit
            </ThemedText>
          </Button>
        </View>
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    padding: 16,
    paddingTop: 60,
    paddingBottom: 60,
    gap: 16,
    justifyContent: "center",
  },
  form: {
    gap: 16,
    padding: 16,
    borderRadius: 8,
  },
  inputs: {
    gap: 8,
  },
});

export default CreateGroup;
