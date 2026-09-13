"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/src/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../hooks/useProjects";
import { ProjectModal } from "./ProjectModal";
import { Project } from "../types";

export function ProjectsList() {
  const { data: projects, isLoading, error } = useProjectsQuery();
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "coverKey",
      header: "Cover",
      cell: ({ row }) => {
        const url = row.original.coverUrl;

        if (!url) {
          return (
            <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
              <span className="text-xs text-gray-400">No Img</span>
            </div>
          );
        }

        return (
          <img
            src={url}
            alt="Cover"
            className="h-10 w-16 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/100x60?text=404";
            }}
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{project.title}</span>
            <span className="text-xs text-gray-500">{project.slug}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "summary",
      header: "Summary",
      cell: ({ row }) => {
        const summary = row.original.summary;
        return (
          <span className="line-clamp-1 max-w-[200px] text-sm text-gray-600 dark:text-gray-300">
            {summary}
          </span>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Status",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex gap-2">
            {project.featured && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Featured
              </span>
            )}
            {project.published ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                Published
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Draft
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "images",
      header: "Images",
      cell: ({ row }) => {
        const count = row.original.images?.length || 0;
        return (
          <span className="text-sm font-medium text-gray-500">
            {count} {count === 1 ? "img" : "imgs"}
          </span>
        );
      },
    },
    {
      accessorKey: "sortOrder",
      header: "Sort",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">{row.original.sortOrder}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedProject(project);
                setIsModalOpen(true);
              }}
              className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <h3 className="text-sm font-medium">Error loading projects</h3>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Projects
        </h1>
        <button
          onClick={() => {
            setSelectedProject(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {projects && projects.length > 0 ? (
              <DataTable columns={columns} data={projects} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects found. Add one to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
          onSave={async (data) => {
            if (selectedProject) {
              await updateMutation.mutateAsync({
                id: selectedProject.id,
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
