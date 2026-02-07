import { useAuthProvider } from "@/lib/context/SessionProvider";
import { Pressable } from "react-native";
import { ThemedText } from "../themed-text";

const SignOut = () => {
  const { signOut } = useAuthProvider();

  return (
    <Pressable onPress={signOut}>
      <ThemedText>Sign Out</ThemedText>
    </Pressable>
  );
};

export default SignOut;
