import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { authAPI } from "@/_features/auth/auth-api";
import { saveTokens, clearTokens, getToken } from "@/_shared/utils/token-manager";
import { log } from "@/_shared/logger/logger";
import { setSessionExpiredHandler } from "@/_shared/utils/api-call";
import type { ApiError } from "@/_shared/types/api-error";
import type { User } from "@/_features/auth/auth-types";

export type AuthResponse = {
  user: User;
  tokens: Tokens;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type RegistrationInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  registerUser: (formData: RegistrationInput) => Promise<void>;
  signIn: (formData: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  sessionErrorMsg: string | null;
  setSessionErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  clearSessionErrorMsg: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [sessionErrorMsg, setSessionErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    //  clearTokens(),

    log.info("AuthProvider | Loading user...");
    try {
      log.info("AuthProvider | Checking for stored user data and tokens...");
      const token = await getToken();
      const storedUser = await SecureStore.getItemAsync("user");

      const userSignedOut = !token && !storedUser;
      const incompleteSession = Boolean(token && !storedUser) || Boolean(!token && storedUser);

      if (userSignedOut) {
        log.info("AuthProvider | No session data found, user is not logged in.");
        return;
      }

      if (incompleteSession) {
        log.warn("AuthProvider | Incomplete session data found, clearing storage...");
        await signOut();
        return;
      }

      log.info("AuthProvider | Session data found, setting user...");

      const parsedUser: User = JSON.parse(storedUser!);
      setUser(parsedUser);

      log.info("AuthProvider | User loaded successfully:", JSON.stringify(parsedUser, null, 2));
    } catch (error) {
      log.error("AuthProvider | Failed to restore session:", error);

      await signOut();
    } finally {
      setIsLoading(false);
      log.info("AuthProvider | Finished loading user");
    }
  };

  const registerUser = async (formData: RegistrationInput) => {
    const res: AuthResponse = await authAPI.registerUser(formData);

    log.info(
      "AuthProvider | registerUser:",
      JSON.stringify(
        {
          user: res.user,
          tokens: res.tokens && true,
        },
        null,
        2,
      ),
    );

    await establishSession(res);
  };

  const signIn = async (formData: SignInInput) => {
    log.info("AuthProvider | Signing in user with email:", formData.email);

    const res: AuthResponse = await authAPI.signIn(formData);

    log.info(
      "AuthProvider | signIn response:",
      JSON.stringify(
        {
          user: res.user,
          tokens: res.tokens && true,
        },
        null,
        2,
      ),
    );

    await establishSession(res);
  };

  const establishSession = async (res: AuthResponse) => {
    const invalidServerResponse = !res || !res.tokens || !res.user;

    if (invalidServerResponse) {
      log.error(
        "AuthProvider | Invalid response from server:",
        JSON.stringify(
          { user: res?.user ?? "No user data", tokens: res?.tokens ? true : "No tokens" },
          null,
          2,
        ),
      );
      throw new Error("Invalid response from server");
    }

    log.info("AuthProvider | Establishing session for user:", JSON.stringify(res.user, null, 2));

    const { accessToken, refreshToken } = res.tokens;
    const user = res.user;

    if (!accessToken || !refreshToken) {
      throw new Error("Missing tokens in the response");
    }

    try {
      const results = await Promise.allSettled([
        saveTokens(accessToken, refreshToken),
        SecureStore.setItemAsync("user", JSON.stringify(user)),
      ]);

      const rejectedResults = results.filter(
        (result): result is PromiseRejectedResult => result.status === "rejected",
      );

      if (rejectedResults.length > 0) {
        const errors = rejectedResults.map((result) =>
          result.reason instanceof Error ? result.reason.message : String(result.reason),
        );

        log.error("AuthProvider | Failed to store session data:", errors);
        throw new Error("Failed to store session data");
      }

      log.info("AuthProvider | Tokens and user data stored successfully");
    } catch (error) {
      log.error("AuthProvider | Failed to establish session, clearing storage:", error);

      await Promise.allSettled([clearTokens(), SecureStore.deleteItemAsync("user")]);

      throw new Error("Failed to establish session", {
        cause: error,
      });
    }

    setUser(user);
    router.replace("/");

    log.info("AuthProvider | Session established for user:", JSON.stringify(user, null, 2));
  };

  const endSession = async () => {
    try {
      const results = await Promise.allSettled([
        clearTokens(),
        SecureStore.deleteItemAsync("user"),
        SecureStore.deleteItemAsync("selectedGroup"),
      ]);

      const rejectedResults = results.filter((result) => result.status === "rejected");

      if (rejectedResults.length > 0) {
        const errors: string[] = rejectedResults.map((result) => result.reason.message);
        log.error("AuthProvider - endSession | Failed to clear session data:", errors);
      }

      log.info("AuthProvider - endSession | Session data cleared successfully");
    } catch (error) {
      log.error("AuthProvider - endSession | Error during session cleanup:", error);
    } finally {
      setUser(null);
      router.replace("/sign-in");
    }
  };

  const signOut = async () => {
    log.info("AuthProvider - signOut | Signing out user...");
    await endSession();
  };

  const forceSignOut = useCallback(
    async (sessionError: ApiError) => {
      log.info("AuthProvider - forceSignOut | Signing out user...");
      setSessionErrorMsg(sessionError.message);
      await endSession();
    },
    [router],
  );

  const clearSessionErrorMsg = () => {
    setSessionErrorMsg(null);
  };

  useEffect(() => {
    setSessionExpiredHandler(forceSignOut);

    return () => {
      setSessionExpiredHandler(null);
    };
  }, [forceSignOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        registerUser,
        signIn,
        signOut,
        sessionErrorMsg,
        setSessionErrorMsg,
        clearSessionErrorMsg,
      }}
    >
      {isLoading ? null : children}
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
