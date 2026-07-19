import { apiCall } from "@/_shared/utils/api-call";
import type { RegistrationInput, SignInInput } from "@/_features/auth/providers/session-provider";

export const authAPI = {
  registerUser: async (formData: RegistrationInput) => {
    const response = await apiCall("/auth/register", "POST", {
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      }),
    });
    return response.data;
  },

  signIn: async (formData: SignInInput) => {
    const response = await apiCall("/auth/login", "POST", {
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    return response.data;
  },
};
