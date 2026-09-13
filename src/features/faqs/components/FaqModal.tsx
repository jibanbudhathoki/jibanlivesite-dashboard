"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Faq, CreateFaqPayload } from "../types";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateFaqPayload) => Promise<void>;
  faq?: Faq;
}

export function FaqModal({ isOpen, onClose, onSave, faq }: FaqModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFaqPayload>({
    defaultValues: {
      question: "",
      answer: "",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (faq) {
        reset({
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder,
        });
      } else {
        reset({
          question: "",
          answer: "",
          sortOrder: 0,
        });
      }
    }
  }, [isOpen, faq, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateFaqPayload) => {
    const cleanData = {
      ...data,
      sortOrder: Number(data.sortOrder),
    };

    try {
      onClose();
      await onSave(cleanData);
    } catch (error: any) {
      console.error("Failed to save FAQ:", error);
      const backendError = error.response?.data;
      alert(`Save failed: ${JSON.stringify(backendError || error.message)}`);
    }
  };

  const inputClassName =
    "w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {faq ? "Edit FAQ" : "Add FAQ"}
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
            id="faq-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("question", { required: "Question is required" })}
                className={inputClassName}
                placeholder="What is your process?"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.question.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("answer", { required: "Answer is required" })}
                rows={5}
                className={inputClassName}
                placeholder="Write the answer here..."
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.answer.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                {...register("sortOrder")}
                className={inputClassName}
              />
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
            form="faq-form"
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
