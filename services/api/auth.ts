import { apiCall } from "@/utils/apiCall";

export const authAPI = {
  signIn: async (email: string, password: string) => {
    return await apiCall("/auth/login", "POST", {
      body: JSON.stringify({ email, password }),
    });
  },
};
