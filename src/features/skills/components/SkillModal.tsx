"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skill, CreateSkillPayload, UpdateSkillPayload } from "../types";
import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
} from "../hooks/useSkills";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  proficiency: z.number().min(0).max(100),
  icon: z.string().max(80).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill | null;
}

export function SkillModal({ isOpen, onClose, skill }: SkillModalProps) {
  const createMutation = useCreateSkillMutation();
  const updateMutation = useUpdateSkillMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency: 50,
      icon: "",
      featured: false,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (skill) {
        reset({
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          icon: skill.icon || "",
          featured: skill.featured || false,
          sortOrder: skill.sortOrder || 0,
        });
      } else {
        reset({
          name: "",
          category: "",
          proficiency: 50,
          icon: "",
          featured: false,
          sortOrder: 0,
        });
      }
    }
  }, [isOpen, skill, reset]);

  const onSubmit = async (data: SkillFormValues) => {
    try {
      // Clean up empty strings that might fail backend validation
      const payload = {
        ...data,
        icon: data.icon || undefined,
      };

      onClose();
      if (skill) {
        updateMutation.mutate({ id: skill.id, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (error: any) {
      console.error("Failed to save skill", error);
      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      alert(
        "Failed to save skill:\n" +
          JSON.stringify(error.response?.data || errorMsg, null, 2),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 sm:p-0">
      <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {skill ? "Edit Skill" : "Add Skill"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            alert(
              "Please fix these form errors before saving:\n" +
                Object.keys(errors)
                  .map(
                    (key) =>
                      `${key}: ${errors[key as keyof typeof errors]?.message}`,
                  )
                  .join("\n"),
            );
            console.log("Validation errors:", errors);
          })}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="e.g. React.js"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category...</option>
              <option value="FRONTEND">FRONTEND</option>
              <option value="BACKEND">BACKEND</option>
              <option value="DATABASE">DATABASE</option>
              <option value="DEVOPS">DEVOPS</option>
              <option value="TOOLS">TOOLS</option>
              <option value="OTHER">OTHER</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Proficiency (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              {...register("proficiency", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            />
            {errors.proficiency && (
              <p className="mt-1 text-xs text-red-500">
                {errors.proficiency.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon (Classname or URL)
            </label>
            <input
              type="text"
              {...register("icon")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="e.g. devicon-javascript-plain or /icons/js.svg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Featured Skill
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort Order
            </label>
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
