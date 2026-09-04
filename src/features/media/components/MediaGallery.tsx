'use client';
import { Upload, Trash2, File as FileIcon } from 'lucide-react';
import { useState } from 'react';

type MediaFile = { id: string; name: string; url: string; size: string };

const mockMedia: MediaFile[] = [
  { id: '1', name: 'hero-bg.jpg', url: 'https://picsum.photos/seed/bg/300/200', size: '2.4 MB' },
  { id: '2', name: 'avatar.png', url: 'https://picsum.photos/seed/avatar/300/200', size: '850 KB' },
];

export function MediaGallery() {
  const [files, setFiles] = useState<MediaFile[]>(mockMedia);

  const handleDelete = (id: string) => {
    setFiles(f => f.filter(file => file.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload, view, and delete media files.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map(file => (
          <div key={file.id} className="relative group rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.name} className="object-cover w-full h-32" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
            </div>
            <button 
              onClick={() => handleDelete(file.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
