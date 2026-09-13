"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience } from "../types";
import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from "../hooks/useExperience";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  location: z.string().max(100).optional(),
  employmentType: z.string().max(50).optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  highlights: z
    .array(z.string().min(1, "Highlight cannot be empty"))
    .optional(),
  sortOrder: z.number().int(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  experience,
}: ExperienceModalProps) {
  const createMutation = useCreateExperienceMutation();
  const updateMutation = useUpdateExperienceMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      highlights: [""],
      sortOrder: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "highlights",
  });

  const isCurrent = watch("isCurrent");

  useEffect(() => {
    if (isOpen) {
      if (experience) {
        reset({
          company: experience.company,
          role: experience.role,
          location: experience.location || "",
          employmentType: experience.employmentType || "",
          startDate: experience.startDate,
          endDate: experience.endDate || "",
          isCurrent: experience.isCurrent,
          description: experience.description || "",
          highlights:
            experience.highlights && experience.highlights.length > 0
              ? experience.highlights
              : [""],
          sortOrder: experience.sortOrder || 0,
        });
      } else {
        reset({
          company: "",
          role: "",
          location: "",
          employmentType: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          highlights: [""],
          sortOrder: 0,
        });
      }
    }
  }, [experience, isOpen, reset]);

  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      const payload = {
        ...data,
        location: data.location || undefined,
        employmentType: data.employmentType || undefined,
        endDate: data.isCurrent ? undefined : data.endDate || undefined,
        description: data.description || undefined,
        highlights: data.highlights?.filter((h) => h.trim() !== "") || [],
        sortOrder: data.sortOrder ?? 0,
      };

      onClose();
      if (experience) {
        updateMutation.mutate({ id: experience.id, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (error: any) {
      console.error("Failed to save experience", error);
      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      alert(
        "Failed to save experience:\n" +
          JSON.stringify(error.response?.data || errorMsg, null, 2),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {experience ? "Edit Experience" : "Add Experience"}
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
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("company")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("role")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                {...register("location")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                placeholder="Mountain View, CA"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Type
              </label>
              <input
                type="text"
                {...register("employmentType")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                placeholder="Full-time, Contract, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate")}
                disabled={isCurrent}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 disabled:opacity-50"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="isCurrent"
                  {...register("isCurrent")}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
                <label
                  htmlFor="isCurrent"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Brief description of your responsibilities..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Highlights
            </label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    {...register(`highlights.${index}`)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    placeholder="E.g., Increased performance by 20%"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append("")}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                + Add Highlight
              </button>
            </div>
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
