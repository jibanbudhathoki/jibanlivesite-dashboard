'use client';
import { DataTable } from '@/src/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Check, MailOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Message = { id: string; name: string; email: string; subject: string; read: boolean };

const mockMessages: Message[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', subject: 'Freelance Inquiry', read: false },
  { id: '2', name: 'Alice Jones', email: 'alice@example.com', subject: 'Collaboration', read: true },
];

export function MessagesList() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleMarkRead = (id: string) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleDelete = (id: string) => {
    setMessages(msgs => msgs.filter(m => m.id !== id));
  };

  const columns: ColumnDef<Message>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className={row.original.read ? 'text-gray-500' : 'font-bold'}>{row.original.name}</span>
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-3">
          {!row.original.read && (
            <button onClick={() => handleMarkRead(row.original.id)} className="text-green-600 hover:text-green-800 dark:text-green-400" title="Mark as Read">
              <Check className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => handleDelete(row.original.id)} className="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Read, delete, and mark inbox messages as read.</p>
      </div>
      <DataTable columns={columns} data={messages} />
    </div>
  );
}
