"use client";

import React, { useState } from "react";
import {
  useSocialsQuery,
  useCreateSocialMutation,
  useUpdateSocialMutation,
  useDeleteSocialMutation,
} from "../hooks/useSocials";
import { SocialLink, CreateSocialPayload } from "../types";
import { SocialModal, PRESET_PLATFORMS } from "./SocialModal";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Globe,
  Youtube,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export function getPlatformIcon(platform: string, className: string = "h-4 w-4") {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return <Instagram className={className} />;
  if (p.includes("linkedin")) return <Linkedin className={className} />;
  if (p.includes("twitter") || p === "x") return <Twitter className={className} />;
  if (p.includes("github")) return <Github className={className} />;
  if (p.includes("email") || p.includes("mail")) return <Mail className={className} />;
  if (p.includes("youtube")) return <Youtube className={className} />;
  if (p.includes("discord")) return <MessageSquare className={className} />;
  return <Globe className={className} />;
}

export function SocialsManager() {
  const { data: socials = [], isLoading } = useSocialsQuery();
  const createMutation = useCreateSocialMutation();
  const updateMutation = useUpdateSocialMutation();
  const deleteMutation = useDeleteSocialMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleOpenAdd = () => {
    setEditingSocial(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (social: SocialLink) => {
    setEditingSocial(social);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete the social link for "${label}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (data: CreateSocialPayload) => {
    setIsModalOpen(false);
    if (editingSocial) {
      updateMutation.mutate({
        id: editingSocial.id,
        payload: data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    const defaults: CreateSocialPayload[] = [
      { platform: "instagram", label: "Instagram", url: "https://instagram.com", sortOrder: 1 },
      { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", sortOrder: 2 },
      { platform: "twitter", label: "Twitter / X", url: "https://twitter.com", sortOrder: 3 },
      { platform: "github", label: "GitHub", url: "https://github.com/jibanbudhathoki", sortOrder: 4 },
      { platform: "email", label: "Email", url: "mailto:contactme@jibanbudhathoki.com.np", sortOrder: 5 },
    ];

    try {
      for (const item of defaults) {
        await createMutation.mutateAsync(item);
      }
    } catch (err) {
      console.error("Failed to seed default social links", err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Live Preview */}
      <div className="rounded-xl border border-gray-200 bg-linear-to-r from-gray-900 to-slate-900 p-6 text-white shadow-md dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Live Portfolio Icon Row Preview
            </span>
            <h3 className="text-lg font-bold text-white mt-2">
              Social Media Connections
            </h3>
            <p className="text-sm text-gray-300 mt-0.5">
              These links appear right below your name on the portfolio hero section.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Social Link
          </button>
        </div>

        {/* Visual representation matching hero section */}
        <div className="mt-6 rounded-lg bg-black/40 p-4 border border-white/10 flex items-center gap-6">
          <span className="text-xs text-gray-400 font-mono">Hero Icons:</span>
          {socials.length === 0 ? (
            <span className="text-xs text-gray-500 italic">
              No social links configured yet. Click &quot;Add Social Link&quot; or quick-load defaults below.
            </span>
          ) : (
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${s.label} (${s.url})`}
                  className="flex items-center justify-center text-white/80 hover:text-blue-400 transition-all hover:scale-110"
                >
                  {getPlatformIcon(s.platform, "h-5 w-5")}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Social Links List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Configured Social Links ({socials.length})
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag or set sort order to arrange how links appear.
            </p>
          </div>

          {socials.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {isSeeding ? "Adding..." : "Quick Load Default Socials"}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs">Loading social links...</p>
          </div>
        ) : socials.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Globe className="h-6 w-6" />
            </div>
            <h5 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No Social Links Added
            </h5>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Add your Instagram, LinkedIn, GitHub, X, or email link to display them on your portfolio hero section.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Link
              </button>
              <button
                onClick={handleSeedDefaults}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Load Default Portfolio Links
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {socials.map((social) => (
              <div
                key={social.id}
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {getPlatformIcon(social.platform, "h-5 w-5")}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {social.label}
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase">
                        {social.platform}
                      </span>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        order: {social.sortOrder ?? 0}
                      </span>
                    </div>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 truncate max-w-md"
                    >
                      <span className="truncate">{social.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => handleOpenEdit(social)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(social.id, social.label)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SocialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          social={editingSocial}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
