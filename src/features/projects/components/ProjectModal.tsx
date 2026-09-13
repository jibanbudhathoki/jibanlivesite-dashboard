"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { Project, CreateProjectPayload } from "../types";
import { uploadMedia } from "../../media/api/media";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProjectPayload) => Promise<void>;
  project?: Project;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectModalProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectPayload>({
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      description: "",
      coverKey: "",
      demoUrl: "",
      repoUrl: "",
      tags: [""],
      featured: false,
      published: true,
      sortOrder: 0,
      startedAt: "",
      completedAt: "",
      images: [],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags" as never,
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (isOpen) {
      if (project) {
        reset({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          description: project.description,
          coverKey: project.coverKey || "",
          demoUrl: project.demoUrl || "",
          repoUrl: project.repoUrl || "",
          tags: project.tags?.length ? project.tags : [""],
          featured: project.featured,
          published: project.published,
          sortOrder: project.sortOrder,
          startedAt: project.startedAt || "",
          completedAt: project.completedAt || "",
          images: project.images || [],
        });
      } else {
        reset({
          slug: "",
          title: "",
          summary: "",
          description: "",
          coverKey: "",
          demoUrl: "",
          repoUrl: "",
          tags: [""],
          featured: false,
          published: true,
          sortOrder: 0,
          startedAt: "",
          completedAt: "",
          images: [],
        });
      }
    }
  }, [isOpen, project, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateProjectPayload) => {
    // Clean up empty tags and fix types
    const cleanData = {
      ...data,
      tags: data.tags.filter((tag: string) => tag.trim() !== ""),
      sortOrder: Number(data.sortOrder),
      coverKey: data.coverKey || undefined,
      demoUrl: data.demoUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      startedAt: data.startedAt
        ? new Date(data.startedAt).toISOString()
        : undefined,
      completedAt: data.completedAt
        ? new Date(data.completedAt).toISOString()
        : undefined,
      images: data.images.map((img) => ({
        ...img,
        sortOrder: img.sortOrder ? Number(img.sortOrder) : 0,
      })),
    };

    try {
      onClose();
      await onSave(cleanData);
    } catch (error: any) {
      console.error("Failed to save project:", error);
      const backendError = error.response?.data;
      alert(`Save failed: ${JSON.stringify(backendError || error.message)}`);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const uploadedData = await uploadMedia(file, "Cover Image");

      // Extract the key from the response object
      const actualStringKey =
        typeof uploadedData === "string"
          ? uploadedData
          : (uploadedData as any)?.mediaKey || (uploadedData as any)?.key || (uploadedData as any)?.url || "";

      setValue("coverKey", actualStringKey, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error: any) {
      console.error("Failed to upload cover:", error);
      const msg = error.response?.data || error.message;
      alert(`Failed to upload cover image: ${JSON.stringify(msg)}`);
    } finally {
      setIsUploadingCover(false);
      e.target.value = ""; // clear input
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImageIndex(index);
      const uploadedData = await uploadMedia(file, "Project Image");

      const actualStringKey =
        typeof uploadedData === "string"
          ? uploadedData
          : (uploadedData as any)?.mediaKey || (uploadedData as any)?.key || (uploadedData as any)?.url || "";

      setValue(`images.${index}.mediaKey`, actualStringKey, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      const msg = error.response?.data || error.message;
      alert(`Failed to upload image: ${JSON.stringify(msg)}`);
    } finally {
      setUploadingImageIndex(null);
      e.target.value = ""; // clear input
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {project ? "Edit Project" : "Add Project"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form
            id="project-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  {...register("slug", { required: "Slug is required" })}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Summary
              </label>
              <textarea
                {...register("summary", { required: "Summary is required" })}
                rows={2}
                className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.summary.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Demo URL
                </label>
                <input
                  type="text"
                  {...register("demoUrl")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Repo URL
                </label>
                <input
                  type="text"
                  {...register("repoUrl")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Started At
                </label>
                <input
                  type="date"
                  {...register("startedAt")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Completed At
                </label>
                <input
                  type="date"
                  {...register("completedAt")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  {...register("sortOrder")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                />
                <label
                  htmlFor="featured"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Featured
                </label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="published"
                  {...register("published")}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Published
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("coverKey")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  {isUploadingCover ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                  />
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={() => appendTag("") as any}
                  className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Tag
                </button>
              </div>
              <div className="space-y-2">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      {...register(`tags.${index}` as const)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Images
                </label>
                <button
                  type="button"
                  onClick={() =>
                    appendImage({ mediaKey: "", alt: "", sortOrder: 0 })
                  }
                  className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Image
                </button>
              </div>
              <div className="space-y-4">
                {imageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start space-x-2 rounded border p-3 dark:border-gray-700"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Media Key
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            {...register(`images.${index}.mediaKey` as const)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          <label className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                            {uploadingImageIndex === index ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              disabled={uploadingImageIndex !== null}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            {...register(`images.${index}.alt` as const)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Sort Order
                          </label>
                          <input
                            type="number"
                            {...register(`images.${index}.sortOrder` as const)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="mt-6 rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="border-t p-4 flex justify-end space-x-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            form="project-form"
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
