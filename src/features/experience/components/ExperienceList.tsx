"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/shared/DataTable";
import { Experience } from "../types";
import {
  useExperiencesQuery,
  useDeleteExperienceMutation,
} from "../hooks/useExperience";
import ExperienceModal from "./ExperienceModal";

export default function ExperienceList() {
  const { data: experiences, isLoading, error } = useExperiencesQuery();
  const deleteMutation = useDeleteExperienceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(
    null,
  );

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error: any) {
      console.error("Failed to delete experience:", error);
      alert(
        "Failed to delete experience:\n" +
          (error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message),
      );
    }
  };

  const columns: ColumnDef<Experience>[] = [
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.company}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "dates",
      header: "Dates",
      cell: ({ row }) => (
        <span>
          {row.original.startDate} - {row.original.isCurrent ? "Present" : row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span className="sr-only">Edit</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <span className="sr-only">Delete</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading experiences
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Experience
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your work experience history.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Experience
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              </div>
            ) : experiences && experiences.length > 0 ? (
              <DataTable columns={columns} data={experiences} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No experience records found. Add one to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={selectedExperience}
      />
    </div>
  );
}
