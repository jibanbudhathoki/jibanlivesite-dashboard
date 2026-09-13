"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSettingsQuery, useUpdateSettingsMutation } from "../hooks/useSettings";
import { uploadMedia } from "@/src/features/media/api/media";
import { 
  CheckCircle2, 
  Globe, 
  Search, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Eye,
  Upload,
  Image as ImageIcon,
  Laptop,
  X,
  Loader2
} from "lucide-react";

export function GeneralSettingsForm() {
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const [siteUrl, setSiteUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [appleTouchIconUrl, setAppleTouchIconUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [googleSiteVerification, setGoogleSiteVerification] = useState("");
  const [bingSiteVerification, setBingSiteVerification] = useState("");
  const [indexingEnabled, setIndexingEnabled] = useState(true);

  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingAppleIcon, setIsUploadingAppleIcon] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePreview, setActivePreview] = useState<"google" | "social" | "tab">("tab");

  useEffect(() => {
    if (settings) {
      setSiteUrl(settings.siteUrl ?? "");
      setSeoTitle(settings.seoTitle ?? "");
      setTitleTemplate(settings.titleTemplate ?? "");
      setSeoDescription(settings.seoDescription ?? "");
      setKeywords(settings.keywords ?? "");
      setOgImageUrl(settings.ogImageUrl ?? "");
      setFaviconUrl(settings.faviconUrl ?? "");
      setAppleTouchIconUrl(settings.appleTouchIconUrl ?? "");
      setLogoUrl(settings.logoUrl ?? "");
      setHeroImageUrl(settings.heroImageUrl ?? "");
      setTwitterHandle(settings.twitterHandle ?? "");
      setGoogleSiteVerification(settings.googleSiteVerification ?? "");
      setBingSiteVerification(settings.bingSiteVerification ?? "");
      if (settings.indexingEnabled !== undefined) {
        setIndexingEnabled(Boolean(settings.indexingEnabled));
      }
    }
  }, [settings]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "favicon" | "apple" | "og" | "logo" | "hero"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (target === "favicon") setIsUploadingFavicon(true);
      if (target === "apple") setIsUploadingAppleIcon(true);
      if (target === "og") setIsUploadingOg(true);
      if (target === "logo") setIsUploadingLogo(true);
      if (target === "hero") setIsUploadingHero(true);

      const res = await uploadMedia(file, target);
      let rawUrl =
        typeof res === "string"
          ? res
          : (res as any)?.url || (res as any)?.data?.url || (res as any)?.data || "";

      if (rawUrl && typeof rawUrl === "string") {
        let finalUrl = rawUrl.trim();
        if (finalUrl.startsWith("/api/")) {
          finalUrl = `https://hostapi.jibanbudhathoki.com.np${finalUrl}`;
        }
        if (target === "favicon") setFaviconUrl(finalUrl);
        if (target === "apple") setAppleTouchIconUrl(finalUrl);
        if (target === "og") setOgImageUrl(finalUrl);
        if (target === "logo") setLogoUrl(finalUrl);
        if (target === "hero") setHeroImageUrl(finalUrl);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setIsUploadingFavicon(false);
      setIsUploadingAppleIcon(false);
      setIsUploadingOg(false);
      setIsUploadingLogo(false);
      setIsUploadingHero(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        siteUrl: siteUrl.trim(),
        seoTitle: seoTitle.trim(),
        titleTemplate: titleTemplate.trim(),
        seoDescription: seoDescription.trim(),
        keywords: keywords.trim(),
        ogImageUrl: ogImageUrl.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
        appleTouchIconUrl: appleTouchIconUrl.trim() || null,
        logoUrl: logoUrl.trim() || null,
        heroImageUrl: heroImageUrl.trim() || null,
        twitterHandle: twitterHandle.trim(),
        googleSiteVerification: googleSiteVerification.trim(),
        bingSiteVerification: bingSiteVerification.trim(),
        indexingEnabled,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to update site settings", err);
      alert("Failed to save SEO settings");
    }
  };

  const titleLength = seoTitle.length;
  const descLength = seoDescription.length;

  const displayCleanDomain = () => {
    try {
      const url = new URL(siteUrl || "https://jibanbudhathoki.com.np");
      return url.hostname;
    } catch {
      return "jibanbudhathoki.com.np";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Site Configuration &amp; SEO Suite
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Configure your live portfolio URL, brand assets, search engine indexing, OpenGraph preview cards, and metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              Site Configuration Saved &amp; Live!
            </div>
          )}
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden disabled:opacity-50 transition-colors cursor-pointer"
          >
            {updateMutation.isPending ? "Saving..." : "Save Site Configuration"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 0: Live Site URL & Domain Configuration */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Live Site URL &amp; Redirect Target
                </h4>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Portfolio Target
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Primary Live Website URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  required
                  placeholder="https://jibanbudhathoki.com.np"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                />
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-3.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shrink-0"
                  title="Test & Visit Live Website"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                When you click <strong>Portfolio Admin</strong> in the top-left sidebar or the <strong>Live Site</strong> button in the header, you will be redirected to this URL.
              </p>
            </div>
          </div>

          {/* Section 1: Search Engine Essentials */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <Search className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Search Engine Essentials
              </h4>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  SEO Meta Title
                </label>
                <span className={`text-[11px] font-mono ${titleLength > 60 ? "text-amber-500" : "text-gray-400"}`}>
                  {titleLength}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                required
                placeholder="Jiban Budhathoki — Software Developer | Portfolio"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Optimal length: 50–60 characters. Appears as the primary clickable headline in search results.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Title Template
              </label>
              <input
                type="text"
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="%s | Jiban Budhathoki"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Meta Description
                </label>
                <span className={`text-[11px] font-mono ${descLength > 160 ? "text-amber-500" : "text-gray-400"}`}>
                  {descLength}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="High-converting summary of your portfolio..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Optimal length: 120–160 characters. Displayed under your title in Google search results.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Target Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Software Developer, Full Stack, React, Next.js, Cloudflare"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Brand Identity & Favicons */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <Globe className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Brand Identity &amp; Favicons
              </h4>
            </div>

            {/* Favicon URL / Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Browser Tab Favicon (.ico, .png, .svg)
                </label>
                {faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFaviconUrl("")}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-xs">
                  {faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconUrl}
                      alt="Favicon Preview"
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Globe className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://jibanbudhathoki.com.np/favicon.ico"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    {isUploadingFavicon ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>{isUploadingFavicon ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept=".ico,.png,.svg,.webp"
                      onChange={(e) => handleFileUpload(e, "favicon")}
                      disabled={isUploadingFavicon}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Displays in browser tabs, bookmarks, and Google search snippets.
              </p>
            </div>

            {/* Apple Touch Icon URL / Upload */}
            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Apple Touch Icon (180 × 180 px PNG)
                </label>
                {appleTouchIconUrl && (
                  <button
                    type="button"
                    onClick={() => setAppleTouchIconUrl("")}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-xs">
                  {appleTouchIconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={appleTouchIconUrl}
                      alt="Apple Touch Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={appleTouchIconUrl}
                    onChange={(e) => setAppleTouchIconUrl(e.target.value)}
                    placeholder="https://jibanbudhathoki.com.np/apple-touch-icon.png"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    {isUploadingAppleIcon ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>{isUploadingAppleIcon ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept=".png,.webp"
                      onChange={(e) => handleFileUpload(e, "apple")}
                      disabled={isUploadingAppleIcon}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Shown when visitors add your portfolio to their iPhone/iPad or Android home screen.
              </p>
            </div>

            {/* Navbar Brand Logo */}
            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Navbar Brand Logo (.png, .svg, .webp)
                </label>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Reset to Default Logo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 flex items-center justify-center overflow-hidden shadow-xs p-1">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Brand Logo Preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-sky-400">JB</span>
                  )}
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://... or upload custom monogram/logo"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    {isUploadingLogo ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>{isUploadingLogo ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept=".png,.webp,.svg"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      disabled={isUploadingLogo}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Displays in the top navigation bar header on both desktop and mobile.
              </p>
            </div>

            {/* Hero Portrait Cutout Image */}
            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Hero Portrait Image (Cutout Photo)
                </label>
                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroImageUrl("")}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Reset to Default Cutout
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 flex items-end justify-center overflow-hidden shadow-xs">
                  {heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroImageUrl}
                      alt="Hero Cutout Preview"
                      className="h-full w-full object-contain object-bottom"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    placeholder="https://... or upload transparent PNG/WebP"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  />

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    {isUploadingHero ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>{isUploadingHero ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept=".png,.webp,.jpg,.jpeg,.svg"
                      onChange={(e) => handleFileUpload(e, "hero")}
                      disabled={isUploadingHero}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Front-and-center cutout photo of yourself on the homepage. Transparent background recommended.
              </p>
            </div>
          </div>

          {/* Section 3: Social Media & OpenGraph Sharing */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <Share2 className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Social Sharing &amp; OpenGraph Cards
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                OpenGraph Share Image (1200 × 630 px)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://jibanbudhathoki.com.np/images/og-preview.png"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                />

                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  {isUploadingOg ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  ) : (
                    <Upload className="h-3.5 w-3.5 text-gray-500" />
                  )}
                  <span>{isUploadingOg ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFileUpload(e, "og")}
                    disabled={isUploadingOg}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Shown when your site is shared on LinkedIn, WhatsApp, iMessage, Twitter/X, and Facebook.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Twitter / X Creator Handle
              </label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@jiban_dev"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 3: Indexing & Search Console Verification */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Webmaster Verification &amp; Crawling
              </h4>
            </div>

            {/* Indexing Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Search Engine Indexing
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {indexingEnabled 
                    ? "Robots tag set to 'index, follow'. Search engines will crawl and index your site."
                    : "Robots tag set to 'noindex, nofollow'. Search engines are instructed to ignore this site."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIndexingEnabled(!indexingEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  indexingEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    indexingEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Google Site Verification
                </label>
                <input
                  type="text"
                  value={googleSiteVerification}
                  onChange={(e) => setGoogleSiteVerification(e.target.value)}
                  placeholder="e.g. google-site-verification token"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Bing Webmaster Verification
                </label>
                <input
                  type="text"
                  value={bingSiteVerification}
                  onChange={(e) => setBingSiteVerification(e.target.value)}
                  placeholder="e.g. msvalidate.01 token"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-indigo-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Live SERP &amp; Share Preview
                </h4>
              </div>

              <div className="flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreview("tab")}
                  className={`px-2 py-1 rounded-sm font-medium transition-all ${
                    activePreview === "tab"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-gray-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  }`}
                >
                  Browser Tab
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview("google")}
                  className={`px-2 py-1 rounded-sm font-medium transition-all ${
                    activePreview === "google"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-gray-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview("social")}
                  className={`px-2 py-1 rounded-sm font-medium transition-all ${
                    activePreview === "social"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-gray-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  }`}
                >
                  Social Card
                </button>
              </div>
            </div>

            {/* Browser Tab Simulation Preview */}
            {activePreview === "tab" && (
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div className="flex items-center gap-2 max-w-[210px] rounded-t-md bg-white dark:bg-gray-800 px-2.5 py-1 text-xs shadow-xs border-t border-x border-gray-200 dark:border-gray-700">
                    {faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="h-3.5 w-3.5 shrink-0 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Globe className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    )}
                    <span className="truncate text-[11px] font-medium text-gray-800 dark:text-gray-200">
                      {seoTitle}
                    </span>
                    <X className="h-3 w-3 shrink-0 text-gray-400 hover:text-gray-600" />
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                  <div className="rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                    <span className="text-emerald-600 font-bold">https://</span>
                    <span>{displayCleanDomain()}</span>
                  </div>
                </div>

                <div className="p-4 text-center py-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live simulation of how your custom favicon and page title appear inside visitors&apos; browser tabs.
                  </p>
                </div>
              </div>
            )}

            {/* Google Search Result Preview */}
            {activePreview === "google" && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Google Search Result (Desktop Simulation)
                </p>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                    {faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={faviconUrl}
                        alt="Google Favicon"
                        className="h-4 w-4 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-indigo-600">J</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight">
                      Jiban Budhathoki
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight flex items-center gap-1 font-mono">
                      https://{displayCleanDomain()}
                      <span className="text-gray-400">›</span>
                    </span>
                  </div>
                </div>

                <h5 className="text-[17px] font-medium text-[#1a0dab] hover:underline cursor-pointer dark:text-[#8ab4f8] leading-snug line-clamp-1">
                  {seoTitle || "Jiban Budhathoki — Software Developer"}
                </h5>

                <p className="mt-1 text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-3">
                  {seoDescription || "Crafting high-performance web applications and responsive user experiences."}
                </p>
              </div>
            )}

            {/* Social Share Card Preview */}
            {activePreview === "social" && (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-xs dark:border-gray-800 dark:bg-gray-950">
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Social Card (X / LinkedIn / Slack)
                  </p>
                </div>
                <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {ogImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ogImageUrl}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-bold text-white">
                        {seoTitle.slice(0, 45)}...
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {displayCleanDomain()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-1 bg-white dark:bg-gray-900">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                    {displayCleanDomain()}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {seoTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {seoDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Quick SEO Health Checklist */}
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800/40 p-3.5 border border-gray-100 dark:border-gray-800 space-y-2">
              <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                SEO Health Diagnostics
              </h5>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Title Length (50–60 chars)</span>
                  <span className={`font-medium ${titleLength >= 40 && titleLength <= 65 ? "text-emerald-600" : "text-amber-500"}`}>
                    {titleLength} chars {titleLength >= 40 && titleLength <= 65 ? "✓" : "•"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Description (120–160 chars)</span>
                  <span className={`font-medium ${descLength >= 100 && descLength <= 165 ? "text-emerald-600" : "text-amber-500"}`}>
                    {descLength} chars {descLength >= 100 && descLength <= 165 ? "✓" : "•"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Crawling Status</span>
                  <span className={`font-medium ${indexingEnabled ? "text-emerald-600" : "text-rose-500"}`}>
                    {indexingEnabled ? "Indexed (Public)" : "NoIndex (Hidden)"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Structured Data (JSON-LD)</span>
                  <span className="font-medium text-emerald-600">Active (Person &amp; WebSite)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">XML Sitemap &amp; Robots</span>
                  <span className="font-medium text-emerald-600">Dynamic Edge Routes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

