"use client";
import {
  useServicesQuery,
  useDeleteServiceMutation,
} from "../hooks/useServices";
import { DataTable } from "@/src/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Service } from "../types";
import { Edit, Trash2 } from "lucide-react";
import { ServiceModal } from "./ServiceModal";
import { useState } from "react";

export function ServicesList() {
  const { data, isLoading, error } = useServicesQuery();
  const deleteMutation = useDeleteServiceMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "title",
      header: "Service Title",
    },
    {
      accessorKey: "description",
      header: "Description",
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
            Services
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your offered services and offerings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Add Service
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-gray-500 text-center border rounded-lg border-gray-200 dark:border-gray-800">
          Loading services...
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center border rounded-lg border-gray-200 dark:border-gray-800">
          Error loading services. Please try again.
        </div>
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
