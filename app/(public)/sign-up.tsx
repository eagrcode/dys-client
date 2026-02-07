import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Platform, StyleSheet, Text, View, TextInput } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/theme";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignUpPress = async () => {
    !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      (!formData.password && alert("Please fill in all fields."));

    console.log("Sign Up pressed with data:", formData);

    const res = await apiCall();

    console.log("API Response:", res);

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });
  };

  const apiCall = async () => {
    try {
      console.log("Attempting to fetch...");
      const response = await fetch("http://192.168.1.241:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error message:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <View style={{ width: "100%", gap: 8 }}>
        <TextInput
          style={styles.input}
          placeholder="First name"
          onChangeText={(content) => handleSetFormData("first_name", content)}
          defaultValue={formData.first_name}
          inputMode="text"
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Last name"
          onChangeText={(content) => handleSetFormData("last_name", content)}
          defaultValue={formData.last_name}
          inputMode="text"
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(content) => handleSetFormData("email", content)}
          defaultValue={formData.email}
          keyboardType="email-address"
          inputMode="email"
          autoComplete="email"
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(content) => handleSetFormData("password", content)}
          defaultValue={formData.password}
          secureTextEntry={true}
          inputMode="text"
        ></TextInput>
      </View>
      <SignUpBtn onPress={handleSignUpPress} />
    </ThemedView>
  );
}

const SignUpBtn = ({ onPress }: { onPress: () => void }) => (
  <Link
    href="/sign-up"
    style={[styles.input, { backgroundColor: Colors.light.tint, borderRadius: 20 }]}
    onPress={onPress}
  >
    <Text style={{ color: Colors.light.background, fontWeight: "bold", textAlign: "center" }}>
      Sign Up
    </Text>
  </Link>
);

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
});
