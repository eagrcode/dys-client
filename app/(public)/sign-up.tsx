import { ThemedView } from "@/components/themed-view";
import { Platform, StyleSheet, Text, View, TextInput, Alert, Pressable } from "react-native";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { apiCall } from "@/utils/apiCall";

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const { signIn } = useAuthProvider();

  const formInputs = [
    {
      key: "first_name",
      placeholder: "First name",
      secure: false,
      inputMode: "text",
      keyboardType: "default",
    },
    {
      key: "last_name",
      placeholder: "Last name",
      secure: false,
      inputMode: "text",
      keyboardType: "default",
    },
    {
      key: "email",
      placeholder: "Email",
      secure: false,
      inputMode: "email",
      keyboardType: "email-address",
    },
    {
      key: "password",
      placeholder: "Password",
      secure: true,
      inputMode: "text",
      keyboardType: "default",
    },
  ] as const;

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignUpPress = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await apiCall("/auth/register", "POST", {
        body: JSON.stringify(formData),
      });
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ width: "100%", gap: 8 }}>
        {formInputs.map(({ key, placeholder, secure, inputMode, keyboardType }) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={placeholder}
            value={(formData as any)[key]}
            onChangeText={(content) => handleSetFormData(key, content)}
            secureTextEntry={secure}
            inputMode={inputMode || "text"}
            keyboardType={keyboardType}
            autoComplete={key === "email" ? "email" : "off"}
            textContentType={
              key === "email" ? "emailAddress" : key === "password" ? "password" : "none"
            }
          />
        ))}
      </View>
      <Pressable style={[styles.input, styles.submitBtn]} onPress={handleSignUpPress}>
        <Text style={styles.submitBtnText}>Sign Up</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.bgLayer2,
    ...Platform.select({
      ios: {
        shadowColor: "hsl(240, 60%, 20%)",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  submitBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    alignItems: "center",
  },
  submitBtnText: {
    color: Colors.light.background,
    fontWeight: "bold",
    textAlign: "center",
  },
});
