'use client';
import { DataTable } from '@/src/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';

interface GenericListProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[];
}

export function GenericList({ title, description, data, columns }: GenericListProps) {
  const actionColumn: ColumnDef<any> = {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex space-x-3">
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400" title="Edit">
          <Edit className="h-4 w-4" />
        </button>
        <button className="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
            Add New
          </button>
        </div>
      </div>
      <DataTable columns={[...columns, actionColumn]} data={data} />
    </div>
  );
}
