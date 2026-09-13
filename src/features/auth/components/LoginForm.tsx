"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation } from "../hooks/useAuth";
import { type LoginCredentials, loginSchema } from "../types";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, X, Check, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginMutation();
  const forgotMutation = useForgotPasswordMutation();
  const resetMutation = useResetPasswordMutation();

  const onSubmit = (data: LoginCredentials) => {
    setError("");
    login(data, {
      onError: (err: any) => {
        console.error("Login Error:", err);
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            err.message ||
            "Invalid email or password"
        );
      },
    });
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your admin email address.");
      return;
    }

    setForgotError("");
    setForgotMsg("");

    forgotMutation.mutate(forgotEmail.trim(), {
      onSuccess: (res) => {
        if (res.data?.token) {
          setResetToken(res.data.token);
          setForgotMsg("Reset token generated! You can now set your new password below.");
          setForgotStep("reset");
        } else {
          setForgotMsg(res.message || "Reset request received. You can now reset your password using your recovery key.");
          setForgotStep("reset");
        }
      },
      onError: (err: any) => {
        setForgotError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            err.message ||
            "Failed to request reset token."
        );
      },
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() && !recoveryKey.trim()) {
      setForgotError("Please provide either a Reset Token or your Master Recovery Key.");
      return;
    }
    if (newPassword.length < 8) {
      setForgotError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("New passwords do not match.");
      return;
    }

    setForgotError("");
    setForgotMsg("");

    resetMutation.mutate(
      {
        email: forgotEmail.trim(),
        newPassword,
        token: resetToken.trim() || undefined,
        recoveryKey: recoveryKey.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsForgotOpen(false);
        },
        onError: (err: any) => {
          setForgotError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Password reset failed. Please check your credentials."
          );
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 sm:p-10 shadow-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your portfolio dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                placeholder="admin@jibanbudhathoki.com.np"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotOpen(true);
                    setForgotError("");
                    setForgotMsg("");
                    setForgotStep("request");
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 pr-10 text-gray-900 placeholder-gray-400 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-hidden shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{isPending ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Reset Admin Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {forgotMsg && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {forgotError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Step Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  setForgotStep("request");
                  setForgotError("");
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  forgotStep === "request"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                1. Request Reset Token
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotStep("reset");
                  setForgotError("");
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  forgotStep === "reset"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                2. Set New Password
              </button>
            </div>

            {forgotStep === "request" ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your registered admin email. A secure 15-minute reset token will be generated to authorize updating your password.
                </p>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@jibanbudhathoki.com.np"
                    required
                    className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotMutation.isPending}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {forgotMutation.isPending ? "Generating Token..." : "Generate Reset Token"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@jibanbudhathoki.com.np"
                    required
                    className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Reset Token or Master Recovery Key
                  </label>
                  <input
                    type="text"
                    value={resetToken || recoveryKey}
                    onChange={(e) => {
                      setResetToken(e.target.value);
                      setRecoveryKey(e.target.value);
                    }}
                    placeholder="Paste 15-minute token OR your SETUP_SECRET"
                    required
                    className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-mono text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    You can use the token generated from Step 1, or your master setup secret (<code className="font-mono">SETUP_SECRET</code>).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetMutation.isPending}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {resetMutation.isPending ? "Resetting Password..." : "Reset Password & Sign In"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
