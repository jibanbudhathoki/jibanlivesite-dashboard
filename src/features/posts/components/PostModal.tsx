"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { Post, CreatePostPayload } from "../types";
import { uploadMedia } from "../../media/api/media";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePostPayload) => Promise<void>;
  post?: Post;
}

export function PostModal({ isOpen, onClose, onSave, post }: PostModalProps) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostPayload>({
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      coverKey: "",
      tags: [""],
      published: true,
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

  useEffect(() => {
    if (isOpen) {
      if (post) {
        reset({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverKey: post.coverKey || "",
          tags: post.tags?.length ? post.tags : [""],
          published: post.published,
        });
      } else {
        reset({
          slug: "",
          title: "",
          excerpt: "",
          content: "",
          coverKey: "",
          tags: [""],
          published: true,
        });
      }
    }
  }, [isOpen, post, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreatePostPayload) => {
    const cleanData = {
      ...data,
      tags: data.tags.filter((tag: string) => tag.trim() !== ""),
      coverKey: data.coverKey || undefined,
    };

    try {
      onClose();
      await onSave(cleanData);
    } catch (error: any) {
      console.error("Failed to save post:", error);
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
      e.target.value = "";
    }
  };

  const inputClassName =
    "w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {post ? "Edit Post" : "Add Post"}
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
            id="post-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={inputClassName}
                  placeholder="My Blog Post"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("slug", { required: "Slug is required" })}
                  className={inputClassName}
                  placeholder="my-blog-post"
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
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("excerpt", { required: "Excerpt is required" })}
                rows={2}
                className={inputClassName}
                placeholder="A brief summary of your post..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.excerpt.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                rows={10}
                className={inputClassName}
                placeholder="Write your post content here... (Markdown supported)"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("coverKey")}
                  className={inputClassName}
                  placeholder="Upload or paste media key"
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="post-published"
                {...register("published")}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
              />
              <label
                htmlFor="post-published"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Published
              </label>
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
                      className={inputClassName}
                      placeholder="Tag name"
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
            form="post-form"
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
