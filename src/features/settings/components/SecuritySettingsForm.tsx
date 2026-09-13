"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Lock,
  Mail,
  UserCheck,
} from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
  changeEmailSchema,
  ChangeEmailFormValues,
} from "@/src/features/auth/types";
import {
  useAuthUserQuery,
  useChangePasswordMutation,
  useChangeEmailMutation,
} from "@/src/features/auth/hooks/useAuth";

export function SecuritySettingsForm() {
  const { data: authUser, isLoading: isLoadingUser } = useAuthUserQuery();

  // Email form state
  const [displayedEmail, setDisplayedEmail] = useState<string>("");
  const [showEmailPwd, setShowEmailPwd] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  useEffect(() => {
    if (authUser?.data?.email) {
      setDisplayedEmail(authUser.data.email);
    }
  }, [authUser?.data?.email]);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
  });

  const { mutate: changeEmail, isPending: isChangingEmail } = useChangeEmailMutation();

  const onEmailSubmit = (data: ChangeEmailFormValues) => {
    setEmailErrorMsg("");
    setEmailSuccessMsg("");

    changeEmail(
      {
        newEmail: data.newEmail,
        password: data.password,
      },
      {
        onSuccess: (res) => {
          const updatedEmail = res?.data?.admin?.email || data.newEmail;
          setDisplayedEmail(updatedEmail);
          setEmailSuccessMsg(res.message || `Admin email changed successfully to ${updatedEmail}!`);
          resetEmail();
          setTimeout(() => setEmailSuccessMsg(""), 6000);
        },
        onError: (err: any) => {
          console.error("Change Email Error:", err);
          setEmailErrorMsg(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Failed to change email. Please check your current password."
          );
        },
      }
    );
  };

  // Password form state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate: changePassword, isPending } = useChangePasswordMutation();

  const onSubmit = (data: ChangePasswordFormValues) => {
    setErrorMsg("");
    setSuccessMsg("");

    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (res) => {
          setSuccessMsg(res.message || "Password changed successfully! Your session has been refreshed.");
          reset();
          setTimeout(() => setSuccessMsg(""), 6000);
        },
        onError: (err: any) => {
          console.error("Change Password Error:", err);
          setErrorMsg(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Failed to change password. Please check your current password."
          );
        },
      }
    );
  };

  const currentEmail = displayedEmail || authUser?.data?.email || (isLoadingUser ? "Loading..." : "admin@jibanbudhathoki.com.np");

  return (
    <div className="space-y-8">
      {/* Change Admin Email Card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Change Admin Login Email
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update the primary email address used to log into this administrative dashboard.
            </p>
          </div>
        </div>

        {/* Current Email Status Display */}
        <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              Current Active Login Email
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
              {currentEmail}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Login
          </span>
        </div>

        {/* Feedback alerts */}
        {emailSuccessMsg && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{emailSuccessMsg}</span>
          </div>
        )}

        {emailErrorMsg && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{emailErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-6 max-w-xl">
          {/* New Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              New Email Address
            </label>
            <div className="relative">
              <input
                {...registerEmail("newEmail")}
                type="email"
                placeholder="newadmin@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {emailErrors.newEmail && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {emailErrors.newEmail.message}
              </p>
            )}
          </div>

          {/* Current Password Verification */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Verify Current Password
            </label>
            <div className="relative">
              <input
                {...registerEmail("password")}
                type={showEmailPwd ? "text" : "password"}
                placeholder="Enter current password to authorize"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowEmailPwd(!showEmailPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showEmailPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {emailErrors.password && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {emailErrors.password.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingEmail}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-indigo-500 focus:outline-hidden disabled:opacity-50 transition-colors cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>{isChangingEmail ? "Updating Email..." : "Update Admin Email"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Change Account Password
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ensure your admin account is protected by using a strong, unique password.
            </p>
          </div>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                {...register("currentPassword")}
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showNew ? "text" : "password"}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-indigo-500 focus:outline-hidden disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>{isPending ? "Updating Password..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Emergency Recovery Information Card */}
      <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/40 dark:bg-indigo-950/10 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Emergency Password Recovery Architecture
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              If you ever forget your password while logged out, you can click <strong className="text-indigo-600 dark:text-indigo-400">Forgot Password</strong> on the login screen. You can reset your password immediately using your secure 15-minute temporary reset token or your master recovery key (<code className="font-mono bg-white dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700">SETUP_SECRET</code>) configured in your Cloudflare environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
