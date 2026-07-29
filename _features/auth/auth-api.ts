import { apiCall } from "@/_shared/utils/api-call";
import type {
  AuthResponse,
  RegistrationInput,
  SignInInput,
} from "@/_features/auth/providers/session-provider";

export const authAPI = {
  registerUser: async (formData: RegistrationInput): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>("/auth/register", "POST", {
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      }),
    });
    return response.data;
  },

  signIn: async (formData: SignInInput): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>("/auth/login", "POST", {
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    return response.data;
  },
};
