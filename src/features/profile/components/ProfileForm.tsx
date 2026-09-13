"use client";

import React, { useEffect, useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../hooks/useProfile";
import { uploadMedia } from "@/src/features/media/api/media";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { StoryBlock } from "../types";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    introLabel: "",
    subtitle: "",
    subtitleLine2: "",
    bio: "",
    ctaText: "",
    ctaHref: "",
    accentColor: "#0146D4",
    email: "",
    location: "",
    phone: "",
    website: "",
    availability: "",
  });

  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Story / About Me State (Multiple Blocks with Image + Rich Text)
  const [storyItems, setStoryItems] = useState<StoryBlock[]>([]);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState<number | null>(null);

  // Sync loaded profile into form state directly from API
  useEffect(() => {
    if (profile) {
      const meta = profile.meta || {};
      const fullName = (profile.fullName ?? "").trim();
      const names = fullName ? fullName.split(" ") : [];
      const firstName = (meta.firstName as string) ?? (names[0] ?? "");
      const lastName = (meta.lastName as string) ?? (names.slice(1).join(" ") ?? "");

      const heroImg =
        (meta.heroImageUrl as string) ??
        profile.avatarUrl ??
        (profile.avatarKey
          ? profile.avatarKey.startsWith("http")
            ? profile.avatarKey
            : `https://hostapi.jibanbudhathoki.com.np/api/v1/files/${profile.avatarKey}`
          : "");
      setHeroImageUrl(heroImg);

      setFormData({
        firstName,
        lastName,
        introLabel: (meta.introLabel as string) ?? "",
        subtitle: profile.headline ?? "",
        subtitleLine2: (meta.subtitleLine2 as string) ?? "",
        bio: profile.bio ?? "",
        ctaText: (meta.ctaText as string) ?? "",
        ctaHref: (meta.ctaHref as string) ?? "",
        accentColor: (meta.accentColor as string) ?? "#0146D4",
        email: profile.email ?? "",
        location: profile.location ?? "",
        phone: profile.phone ?? "",
        website: profile.website ?? "",
        availability: profile.availability ?? "",
      });

      const story = (meta.aboutStory as any) || {};

      if (Array.isArray(story.items) && story.items.length > 0) {
        setStoryItems(story.items);
      } else {
        const b1Content =
          Array.isArray(story.paragraphs1) && story.paragraphs1.length > 0
            ? story.paragraphs1.map((p: string) => `<p>${p}</p>`).join("")
            : `<p>${story.storyBio1 || "Award-winning designer that won the awwwards price in october 2021 for an IDE website that also focus on the UX to make the product more human-like and build it on design system."}</p><p>${story.storyBio2 || "My goal before 30 is to impact 1,000,000 persons positively where I can make a change in their life."}</p>`;

        const b2Content =
          Array.isArray(story.paragraphs2) && story.paragraphs2.length > 0
            ? story.paragraphs2.map((p: string) => `<p>${p}</p>`).join("")
            : `<p>${story.storyBio3 || "If you see me not online or designing then you should know that I’m building something or ideating about a new startup that I have in mind."}</p><p>${story.storyBio4 || "I truly want to leave something good in this life to be remembered by."}</p><p>${story.storyBio5 || "Currently, I’m making this post just so that I step away a bit from work and my problems to remember where I have came from."}</p>`;

        setStoryItems([
          {
            id: "story-block-1",
            image: story.storyImage1 || "https://jibanbudhathoki.com.np/images/jiban.png",
            content: b1Content,
            layout: "image-left",
          },
          {
            id: "story-block-2",
            image: story.storyImage2 || "https://jibanbudhathoki.com.np/images/hero.png",
            content: b2Content,
            layout: "image-right",
          },
        ]);
      }
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingHero(true);
      const res = await uploadMedia(file, "Hero Portrait");
      let rawUrl =
        typeof res === "string"
          ? res
          : (res as any)?.url || (res as any)?.data?.url || (res as any)?.data || "";

      if (rawUrl && typeof rawUrl === "string") {
        let finalUrl = rawUrl.trim();
        if (finalUrl.startsWith("/api/")) {
          finalUrl = `https://hostapi.jibanbudhathoki.com.np${finalUrl}`;
        }
        setHeroImageUrl(finalUrl);
      }
    } catch (err: any) {
      console.error("Failed to upload hero image:", err);
      alert("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setIsUploadingHero(false);
      e.target.value = "";
    }
  };

  const handleAddStoryBlock = () => {
    const nextIdx = storyItems.length;
    const newBlock: StoryBlock = {
      id: `story-block-${Date.now()}`,
      image: "",
      content: "<p>Write your narrative story here...</p>",
      layout: nextIdx % 2 === 0 ? "image-left" : "image-right",
    };
    setStoryItems((prev) => [...prev, newBlock]);
  };

  const handleRemoveStoryBlock = (index: number) => {
    setStoryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveStoryBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= storyItems.length) return;
    setStoryItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleUpdateStoryBlock = (index: number, updates: Partial<StoryBlock>) => {
    setStoryItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleBlockImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBlockIndex(index);
      const res = await uploadMedia(file, `Story Content Photo ${index + 1}`);
      let rawUrl =
        typeof res === "string"
          ? res
          : (res as any)?.url || (res as any)?.data?.url || (res as any)?.data || "";

      if (rawUrl && typeof rawUrl === "string") {
        let finalUrl = rawUrl.trim();
        if (finalUrl.startsWith("/api/")) {
          finalUrl = `https://hostapi.jibanbudhathoki.com.np${finalUrl}`;
        }
        handleUpdateStoryBlock(index, { image: finalUrl });
      }
    } catch (err: any) {
      console.error("Failed to upload block image:", err);
      alert("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setUploadingBlockIndex(null);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    const websiteClean = formData.website.trim();
    const validWebsite = websiteClean
      ? websiteClean.startsWith("http://") || websiteClean.startsWith("https://")
        ? websiteClean
        : `https://${websiteClean}`
      : "";

    try {
      await updateMutation.mutateAsync({
        fullName: fullName || "Jiban Budhathoki",
        headline: formData.subtitle,
        bio: formData.bio,
        location: formData.location,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: validWebsite,
        availability: formData.availability,
        avatarKey: heroImageUrl.trim() || null,
        meta: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          introLabel: formData.introLabel,
          subtitleLine2: formData.subtitleLine2,
          ctaText: formData.ctaText,
          ctaHref: formData.ctaHref,
          accentColor: formData.accentColor,
          heroImageUrl: heroImageUrl.trim() || null,
          aboutStory: {
            items: storyItems,
            storyImage1: storyItems[0]?.image || "",
            storyImage2: storyItems[1]?.image || "",
            paragraphs1: (storyItems[0]?.content || "")
              .replace(/<[^>]+>/g, "\n")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            paragraphs2: (storyItems[1]?.content || "")
              .replace(/<[^>]+>/g, "\n")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            storyBio1: "",
            storyBio2: "",
            storyBio3: "",
            storyBio4: "",
            storyBio5: "",
          },
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error("Failed to update profile", err);
      setErrorMessage(
        err?.response?.data?.error?.message ||
          err?.message ||
          "Failed to save profile. Please check inputs and try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Hero Preview Card (Matches screenshot directly) */}
      <div className="rounded-xl border border-gray-800 bg-[#0B0F17] p-6 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
              Live Hero Section Preview
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Real-time preview of your portfolio hero
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Name & Bar */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {formData.firstName || "First"}
              <br />
              {formData.lastName || "Last"}
            </h2>
            <div
              className="h-2 w-20 rounded-xs"
              style={{ backgroundColor: formData.accentColor || "#0146D4" }}
            />
            <p className="text-xs text-gray-400">
              Accent Color: {formData.accentColor}
            </p>
          </div>

          {/* Center Column: Hero Portrait Image */}
          <div className="md:col-span-4 flex items-center justify-center">
            <div className="relative h-56 w-48 rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden flex items-end justify-center shadow-inner group">
              {heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImageUrl}
                  alt="Hero Cutout Preview"
                  className="h-full w-full object-contain object-bottom drop-shadow-2xl transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-3 text-center text-gray-500">
                  <User className="h-12 w-12 text-gray-600" />
                  <span className="text-[11px] text-gray-400">Default Cutout Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Roles, Intro, Bio, CTA */}
          <div className="md:col-span-4 space-y-3 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0">
            <span className="text-xs sm:text-sm font-medium text-gray-400">
              {formData.introLabel || "- Introducing"}
            </span>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {formData.subtitle || "Your Primary Role"}
              <br />
              <span className="text-gray-300 font-medium">
                {formData.subtitleLine2 || "Your Secondary Role"}
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg line-clamp-4">
              {formData.bio}
            </p>

            <div>
              <span
                className="inline-flex items-center gap-2 font-semibold text-sm underline decoration-2 underline-offset-4 cursor-pointer"
                style={{ color: formData.accentColor || "#0146D4" }}
              >
                <span>{formData.ctaText || "My story"}</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Hero &amp; About Customizer
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update the hero image, text, titles, bio, and call-to-action that greet visitors on your homepage.
            </p>
          </div>

          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Hero Saved &amp; Live!
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900">
            {errorMessage}
          </div>
        )}

        {/* Section: Hero Portrait Image */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Hero Portrait Image (Cutout Photo)
              </h4>
            </div>
            {heroImageUrl && (
              <button
                type="button"
                onClick={() => setHeroImageUrl("")}
                className="text-xs text-rose-500 hover:underline"
              >
                Reset to Default Cutout
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative h-28 w-24 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 overflow-hidden flex items-end justify-center shadow-xs">
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
                <div className="flex flex-col items-center justify-center h-full gap-1 text-center p-2 text-gray-400">
                  <User className="h-8 w-8 text-gray-500" />
                  <span className="text-[10px]">Default</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://... or upload a transparent PNG/WebP"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                />

                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  {isUploadingHero ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  ) : (
                    <Upload className="h-3.5 w-3.5 text-gray-500" />
                  )}
                  <span>{isUploadingHero ? "Uploading..." : "Upload Photo"}</span>
                  <input
                    type="file"
                    accept=".png,.webp,.jpg,.jpeg,.svg"
                    onChange={handleHeroUpload}
                    disabled={isUploadingHero}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                This image appears front-and-center in your hero section. Recommended: transparent PNG or WebP cutout of yourself.
              </p>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jiban"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Budhathoki"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Roles & Intro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intro Label
            </label>
            <input
              type="text"
              name="introLabel"
              value={formData.introLabel}
              onChange={handleChange}
              placeholder="- Introducing"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Line 1 (Headline)
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Full Stack Engineer"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Line 2
            </label>
            <input
              type="text"
              name="subtitleLine2"
              value={formData.subtitleLine2}
              onChange={handleChange}
              placeholder="Backend Developer."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Bio / About text */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About &amp; Bio Paragraph
            </label>
            <span className="text-xs text-gray-400">
              {formData.bio.length} characters
            </span>
          </div>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a compelling overview of your expertise, experience, and passions..."
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white leading-relaxed"
          />
        </div>

        {/* CTA & Accent Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="My story"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              CTA Link Target
            </label>
            <input
              type="text"
              name="ctaHref"
              value={formData.ctaHref}
              onChange={handleChange}
              placeholder="/story"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                className="h-9 w-12 cursor-pointer rounded-md border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-800"
              />
              <input
                type="text"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                placeholder="#0146D4"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contactme@jibanbudhathoki.com.np"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Kathmandu, Nepal"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Availability Status
            </label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Available for new projects"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* About Me Story Section for /story page */}
        {/* ========================================================================= */}
        <div className="border-t border-gray-100 pt-6 dark:border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  About Me Story Content (/story page)
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add as many story content blocks as you want. Each block includes its own photo and rich text editor with full formatting controls.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStoryBlock}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Story Block</span>
            </button>
          </div>

          {/* List of Story Blocks */}
          <div className="space-y-6">
            {storyItems.map((block, idx) => (
              <div
                key={block.id || idx}
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/60 p-5 shadow-xs space-y-4"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Story Block #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStoryBlock(idx, -1)}
                      title="Move up"
                      className="rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === storyItems.length - 1}
                      onClick={() => handleMoveStoryBlock(idx, 1)}
                      title="Move down"
                      className="rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveStoryBlock(idx)}
                      title="Delete block"
                      className="rounded p-1 text-rose-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left / Top: Block Photo */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Block Photo
                      </label>
                      {block.image && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStoryBlock(idx, { image: "" })}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {block.image ? (
                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={block.image}
                            alt={`Story Photo ${idx + 1}`}
                            className="h-full w-full object-cover grayscale contrast-125"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400">
                          <ImageIcon className="h-7 w-7" />
                        </div>
                      )}

                      <div className="flex-1 space-y-1.5">
                        <input
                          type="url"
                          value={block.image || ""}
                          onChange={(e) => handleUpdateStoryBlock(idx, { image: e.target.value })}
                          placeholder="https://... image URL"
                          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                        />
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                          {uploadingBlockIndex === idx ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                          ) : (
                            <Upload className="h-3.5 w-3.5 text-gray-500" />
                          )}
                          <span>{uploadingBlockIndex === idx ? "Uploading..." : "Upload Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBlockImageUpload(e, idx)}
                            disabled={uploadingBlockIndex === idx}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Photo is optional. If left empty, text spans full width.
                    </p>
                  </div>

                  {/* Right: Rich Text Editor */}
                  <div className="lg:col-span-8 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                      Rich Text Story Content
                    </label>
                    <RichTextEditor
                      value={block.content}
                      onChange={(html) => handleUpdateStoryBlock(idx, { content: html })}
                      placeholder="Write your story statements, philosophy, milestones..."
                      minHeight="140px"
                    />
                  </div>
                </div>
              </div>
            ))}

            {storyItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center bg-gray-50/50 dark:bg-gray-800/20">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  No story content blocks added yet.
                </p>
                <button
                  type="button"
                  onClick={handleAddStoryBlock}
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add your first story block
                </button>
              </div>
            )}
          </div>

          {storyItems.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleAddStoryBlock}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 px-5 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Story Block</span>
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {updateMutation.isPending ? "Saving changes..." : "Save About & Hero Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
