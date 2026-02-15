import { ThemedView } from "@/components/themed-view";
import { Platform, StyleSheet, Text, View, TextInput, Alert, Pressable } from "react-native";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { useAuthProvider } from "@/lib/context/SessionProvider";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useAuthProvider();

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignInPress = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      Alert.alert("Sign In Failed", error.message || "Check your credentials and try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ width: "100%", gap: 8 }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(content) => handleSetFormData("email", content)}
          keyboardType="email-address"
          inputMode="email"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(content) => handleSetFormData("password", content)}
          secureTextEntry={true}
          inputMode="text"
          autoComplete="password"
          textContentType="password"
        />
      </View>
      <Pressable
        style={[styles.input, styles.submitBtn]}
        onPress={handleSignInPress}
      >
        <Text style={styles.submitBtnText}>Sign In</Text>
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
