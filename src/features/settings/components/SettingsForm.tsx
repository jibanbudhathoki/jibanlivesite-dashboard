import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProfileForm } from "@/src/features/profile/components/ProfileForm";
import { SocialsManager } from "@/src/features/socials/components/SocialsManager";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { SecuritySettingsForm } from "./SecuritySettingsForm";
import { User, Share2, Globe, Sliders, ShieldCheck } from "lucide-react";

export function SettingsForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabQuery = searchParams.get("tab");
  const resolveTab = (t: string | null): "about" | "socials" | "seo" | "security" => {
    if (t === "socials" || t === "security") return t;
    if (t === "seo" || t === "site" || t === "site-config" || t === "config") return "seo";
    return "about";
  };

  const [activeTab, setActiveTab] = useState<"about" | "socials" | "seo" | "security">(
    resolveTab(tabQuery)
  );

  useEffect(() => {
    setActiveTab(resolveTab(tabQuery));
  }, [tabQuery]);

  const handleTabChange = (tab: "about" | "socials" | "seo" | "security") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    {
      id: "about" as const,
      name: "About & Hero Section",
      description: "Name, titles, bio, and hero story CTA",
      icon: User,
    },
    {
      id: "socials" as const,
      name: "Social Links",
      description: "Instagram, LinkedIn, X, GitHub, Email",
      icon: Share2,
    },
    {
      id: "seo" as const,
      name: "Site Configuration",
      description: "Live URL, site branding, SEO meta & indexing",
      icon: Globe,
    },
    {
      id: "security" as const,
      name: "Security & Credentials",
      description: "Admin email, password, and recovery keys",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Sliders className="h-4 w-4" />
          Settings &amp; Personalization
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Portfolio Customizer
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize your hero profile, social media connections, security credentials, and global website configurations.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                className={`group flex items-center gap-2.5 border-b-2 py-3 px-2 sm:px-3 text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500"
                  }`}
                />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === "about" && <ProfileForm />}
        {activeTab === "socials" && <SocialsManager />}
        {activeTab === "seo" && <GeneralSettingsForm />}
        {activeTab === "security" && <SecuritySettingsForm />}
      </div>
    </div>
  );
}
