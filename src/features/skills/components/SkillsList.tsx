"use client";
import { useSkillsQuery, useDeleteSkillMutation } from "../hooks/useSkills";
import { DataTable } from "@/src/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Skill } from "../types";
import { Edit, Trash2 } from "lucide-react";
import { SkillModal } from "./SkillModal";
import { useState } from "react";

export function SkillsList() {
  const { data, isLoading, error } = useSkillsQuery();
  const deleteMutation = useDeleteSkillMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error: any) {
      console.error("Failed to delete skill:", error);
      alert(
        "Failed to delete skill:\n" +
          (error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message),
      );
    }
  };

  const columns: ColumnDef<Skill>[] = [
    {
      accessorKey: "name",
      header: "Skill Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "proficiency",
      header: "Proficiency",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[100px]">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${row.original.proficiency}%` }}
            ></div>
          </div>
          <span className="text-sm">{row.original.proficiency}%</span>
        </div>
      ),
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.original.featured ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}
        >
          {row.original.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Skills
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your technical skills and proficiencies.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Add Skill
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-gray-500 text-center border rounded-lg border-gray-200 dark:border-gray-800">
          Loading skills...
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center border rounded-lg border-gray-200 dark:border-gray-800">
          Error loading skills. Please try again.
        </div>
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}

      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={selectedSkill}
      />
    </div>
  );
}
