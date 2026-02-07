import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Platform, StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { useAuthProvider } from "@/lib/context/SessionProvider";
import { useRouter } from "expo-router";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useAuthProvider();
  const router = useRouter();

  const handleSetFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignInPress = async () => {
    // Fixed validation logic
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    console.log("Sign In pressed with data:", formData);

    await signIn(formData.email, formData.password);
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ width: "100%", gap: 8 }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(content) => handleSetFormData("email", content)}
          onEndEditing={(e) => handleSetFormData("email", e.nativeEvent.text)}
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
          onEndEditing={(e) => handleSetFormData("password", e.nativeEvent.text)}
          secureTextEntry={true}
          inputMode="text"
          autoComplete="password"
          textContentType="password"
        />
      </View>
      <SignInBtn onPress={handleSignInPress} />
    </ThemedView>
  );
}

const SignInBtn = ({ onPress }: { onPress: () => void }) => (
  <Link
    href="/sign-in"
    style={[styles.input, { backgroundColor: Colors.light.tint, borderRadius: 20 }]}
    onPress={onPress}
  >
    <Text style={{ color: Colors.light.background, fontWeight: "bold", textAlign: "center" }}>
      Sign In
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
