import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import { authAPI } from "@/services/api/auth";
import { initializeToken, saveTokens, clearTokens } from "@/services/tokenManager";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    console.log("AuthProvider | Loading user...");
    try {
      console.log("AuthProvider | Checking for existing token...");
      const { token } = await initializeToken();
      if (token) {
        console.log("AuthProvider | Token found, loading user data...");
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          setUser(JSON.parse(userData));
          console.log("Auth Provider | User data:", userData);
        }
      }
      console.log("AuthProvider | No valid token found, user is not authenticated.");
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = () => {
    router.replace("/");
  };

  const signIn = async (email: string, password: string) => {
    const data = await authAPI.signIn(email, password);

    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
    };

    await saveTokens(data.user.accessToken, data.user.refreshToken);
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
    setUser(userData);

    redirectUser();
  };

  const signOut = async () => {
    await clearTokens();
    await SecureStore.deleteItemAsync("userData");
    setUser(null);

    redirectUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthProvider must be used within an AuthProvider");
  }
  return context;
};
