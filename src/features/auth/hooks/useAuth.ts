import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginCredentials } from "../types";
import { useRouter } from "next/navigation";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push("/admin");
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
