"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/shared/DataTable";
import { Faq } from "../types";
import {
  useFaqsQuery,
  useDeleteFaqMutation,
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from "../hooks/useFaqs";
import { Edit, Trash2 } from "lucide-react";
import { FaqModal } from "./FaqModal";

export function FaqsList() {
  const { data: faqs, isLoading, error, refetch } = useFaqsQuery();
  const deleteMutation = useDeleteFaqMutation();
  const createMutation = useCreateFaqMutation();
  const updateMutation = useUpdateFaqMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | undefined>(
    undefined,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      alert("Failed to delete FAQ");
    }
  };

  const columns: ColumnDef<Faq>[] = [
    {
      accessorKey: "sortOrder",
      header: "Order",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
          {row.getValue("sortOrder")}
        </span>
      ),
    },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <div className="font-medium text-gray-900 dark:text-white max-w-md">
            {faq.question}
          </div>
        );
      },
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <div className="max-w-md truncate text-sm text-gray-500 dark:text-gray-400">
          {row.getValue("answer")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {date ? new Date(date).toLocaleDateString() : "—"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedFaq(faq);
                setIsModalOpen(true);
              }}
              className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(faq.id)}
              disabled={deleteMutation.isPending}
              className="rounded p-2 text-red-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  // Sort FAQs by sortOrder
  const sortedFaqs = faqs ? [...faqs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your FAQ items displayed across your live portfolio.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedFaq(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Add FAQ
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading FAQs...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 shadow-sm">
          <h3 className="text-sm font-semibold">Error loading FAQs</h3>
          <p className="mt-1 text-xs">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : sortedFaqs.length > 0 ? (
        <DataTable columns={columns} data={sortedFaqs} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">
            No FAQs found. Click the button above to create your first FAQ.
          </p>
        </div>
      )}

      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (selectedFaq) {
            await updateMutation.mutateAsync({
              id: selectedFaq.id,
              data,
            });
          } else {
            await createMutation.mutateAsync(data);
          }
        }}
        faq={selectedFaq}
      />
    </div>
  );
}
