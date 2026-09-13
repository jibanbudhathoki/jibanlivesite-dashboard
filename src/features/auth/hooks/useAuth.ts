import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginCredentials } from "../types";
import { useNavigate } from "react-router-dom";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
      }
      navigate("/");
    },
  });
};

export const useAuthUserQuery = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getMe,
    retry: 1,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(payload),
  });
};

export const useChangeEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { newEmail: string; password: string }) =>
      authService.changeEmail(payload),
    onSuccess: (data) => {
      if (data?.data?.admin) {
        queryClient.setQueryData(authKeys.me(), {
          success: true,
          data: data.data.admin,
        });
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: {
      email: string;
      newPassword: string;
      token?: string;
      recoveryKey?: string;
    }) => authService.resetPassword(payload),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        navigate("/");
      }
    },
  });
};
