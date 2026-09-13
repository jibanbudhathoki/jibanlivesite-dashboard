"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/shared/DataTable";
import { Education } from "../types";
import {
  useEducationsQuery,
  useDeleteEducationMutation,
  useCreateEducationMutation,
  useUpdateEducationMutation,
} from "../hooks/useEducation";
import { Edit, Trash2 } from "lucide-react";
import { EducationModal } from "./EducationModal";

export function EducationList() {
  const { data: educations, isLoading, error } = useEducationsQuery();
  const deleteMutation = useDeleteEducationMutation();
  const createMutation = useCreateEducationMutation();
  const updateMutation = useUpdateEducationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete education:", error);
      alert("Failed to delete education");
    }
  };

  const columns: ColumnDef<Education>[] = [
    {
      accessorKey: "institution",
      header: "Institution",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.getValue("institution")}
        </div>
      ),
    },
    {
      accessorKey: "degree",
      header: "Degree",
      cell: ({ row }) => (
        <div className="text-gray-500 dark:text-gray-400">
          {row.getValue("degree")}
        </div>
      ),
    },
    {
      accessorKey: "field",
      header: "Field of Study",
      cell: ({ row }) => (
        <div className="text-gray-500 dark:text-gray-400">
          {row.getValue("field")}
        </div>
      ),
    },
    {
      id: "dates",
      header: "Dates",
      cell: ({ row }) => {
        const start = row.original.startDate
          ? new Date(row.original.startDate).getFullYear()
          : "";
        const end = row.original.endDate
          ? new Date(row.original.endDate).getFullYear()
          : "Present";
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {start} - {end}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const education = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedEducation(education);
                setIsModalOpen(true);
              }}
              className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(education.id)}
              disabled={deleteMutation.isPending}
              className="rounded p-2 text-red-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading educations
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Education
        </h2>
        <button
          onClick={() => {
            setSelectedEducation(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Add Education
        </button>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              </div>
            ) : educations && educations.length > 0 ? (
              <DataTable columns={columns} data={educations} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No education history found. Click the button above to add one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EducationModal
          education={selectedEducation}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            if (selectedEducation) {
              await updateMutation.mutateAsync({
                id: selectedEducation.id,
                data,
              });
            } else {
              await createMutation.mutateAsync(data);
            }
          }}
        />
      )}
    </div>
  );
}
