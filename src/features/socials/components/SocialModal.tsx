"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialLink, CreateSocialPayload } from "../types";
import { X, Globe, Mail, Instagram, Linkedin, Twitter, Github, Youtube, MessageSquare } from "lucide-react";

const socialSchema = z.object({
  platform: z.string().min(1, "Platform name is required").max(40),
  label: z.string().min(1, "Label is required").max(80),
  url: z.string().min(1, "URL is required").max(500),
  sortOrder: z.number().int(),
});

type SocialFormData = z.infer<typeof socialSchema>;

export const PRESET_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, placeholder: "https://twitter.com/username" },
  { id: "github", name: "GitHub", icon: Github, placeholder: "https://github.com/username" },
  { id: "email", name: "Email", icon: Mail, placeholder: "mailto:contactme@example.com" },
  { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@channel" },
  { id: "discord", name: "Discord", icon: MessageSquare, placeholder: "https://discord.gg/..." },
  { id: "website", name: "Website", icon: Globe, placeholder: "https://yourwebsite.com" },
];

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  social?: SocialLink | null;
  onSave: (data: CreateSocialPayload) => Promise<void>;
}

export function SocialModal({ isOpen, onClose, social, onSave }: SocialModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      platform: "instagram",
      label: "Instagram",
      url: "",
      sortOrder: 0,
    },
  });

  const selectedPlatform = watch("platform");

  useEffect(() => {
    if (social) {
      reset({
        platform: social.platform,
        label: social.label,
        url: social.url,
        sortOrder: social.sortOrder ?? 0,
      });
    } else {
      reset({
        platform: "instagram",
        label: "Instagram",
        url: "",
        sortOrder: 0,
      });
    }
  }, [social, reset]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof PRESET_PLATFORMS)[0]) => {
    setValue("platform", preset.id);
    setValue("label", preset.name);
    if (!watch("url") || watch("url").startsWith("https://") || watch("url").startsWith("mailto:")) {
      setValue("url", preset.placeholder);
    }
  };

  const onSubmit = async (data: SocialFormData) => {
    try {
      let rawUrl = data.url.trim();
      if (
        !rawUrl.startsWith("http://") &&
        !rawUrl.startsWith("https://") &&
        !rawUrl.startsWith("mailto:") &&
        !rawUrl.startsWith("tel:")
      ) {
        if (data.platform === "email" || rawUrl.includes("@")) {
          rawUrl = `mailto:${rawUrl}`;
        } else {
          rawUrl = `https://${rawUrl}`;
        }
      }

      onClose();
      await onSave({
        platform: data.platform.toLowerCase().trim(),
        label: data.label.trim(),
        url: rawUrl,
        sortOrder: Number(data.sortOrder) || 0,
      });
    } catch (err: any) {
      console.error("Failed to save social link:", err);
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err.message ||
        "Failed to save social link. Please check the URL.";
      alert(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {social ? "Edit Social Link" : "Add Social Link"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Customize social media profile links displayed on your portfolio.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mb-2">
            Quick Platform Presets
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_PLATFORMS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPlatform?.toLowerCase() === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs"
                      : "border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform Identifier
            </label>
            <input
              type="text"
              {...register("platform")}
              placeholder="e.g. instagram, linkedin, twitter, github, email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {errors.platform && (
              <p className="mt-1 text-xs text-red-500">{errors.platform.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Label / Tooltip
            </label>
            <input
              type="text"
              {...register("label")}
              placeholder="e.g. Instagram, LinkedIn, Jiban's GitHub"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {errors.label && (
              <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL / Link Target
            </label>
            <input
              type="text"
              {...register("url")}
              placeholder="https://... or mailto:..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {errors.url && (
              <p className="mt-1 text-xs text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort Order (0 = First)
            </label>
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {errors.sortOrder && (
              <p className="mt-1 text-xs text-red-500">{errors.sortOrder.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-hidden disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? "Saving..." : social ? "Save Changes" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
