"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEducationPayload, Education } from "../types";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationModalProps {
  education?: Education | null;
  onClose: () => void;
  onSave: (data: CreateEducationPayload) => Promise<void>;
}

export function EducationModal({
  education,
  onClose,
  onSave,
}: EducationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (education) {
      reset({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startDate: education.startDate
          ? new Date(education.startDate).toISOString().split("T")[0]
          : "",
        endDate: education.endDate
          ? new Date(education.endDate).toISOString().split("T")[0]
          : "",
        description: education.description || "",
        sortOrder: education.sortOrder || 0,
      });
    } else {
      reset({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
        sortOrder: 0,
      });
    }
  }, [education, reset]);

  const onSubmit = async (data: EducationFormData) => {
    try {
      onClose();
      await onSave(data);
    } catch (error: any) {
      alert(error.message || "An error occurred while saving.");
    }
  };

  const inputClassName =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 sm:p-0">
      <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {education ? "Edit Education" : "Add Education"}
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
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("institution")}
                className={inputClassName}
                placeholder="University Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("degree")}
                className={inputClassName}
                placeholder="Bachelor of Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("field")}
                className={inputClassName}
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort Order
              </label>
              <input
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                className={inputClassName}
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
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className={inputClassName}
              placeholder="Brief description of your studies..."
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
