"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/shared/DataTable";
import { Post } from "../types";
import {
  usePostsQuery,
  useDeletePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../hooks/usePosts";
import { Edit, Trash2 } from "lucide-react";
import { PostModal } from "./PostModal";

export function PostsList() {
  const { data: posts, isLoading, error } = usePostsQuery();
  const deleteMutation = useDeletePostMutation();
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(
    undefined,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "coverUrl",
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
          // eslint-disable-next-line @next/next/no-img-element
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
        const post = row.original;
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {post.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {post.slug}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "excerpt",
      header: "Excerpt",
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-gray-500 dark:text-gray-400">
          {row.getValue("excerpt")}
        </div>
      ),
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("published");
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              published
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {published ? "Published" : "Draft"}
          </span>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.original.tags || [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        );
      },
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
        const post = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedPost(post);
                setIsModalOpen(true);
              }}
              className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(post.id)}
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
          Loading posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <h3 className="text-sm font-medium">Error loading posts</h3>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Blog Posts
        </h1>
        <button
          onClick={() => {
            setSelectedPost(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Post
        </button>
      </div>

      {posts && posts.length > 0 ? (
        <DataTable columns={columns} data={posts} />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No posts found. Click the button above to create your first post.
          </p>
        </div>
      )}

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (selectedPost) {
            await updateMutation.mutateAsync({
              id: selectedPost.id,
              data,
            });
          } else {
            await createMutation.mutateAsync(data);
          }
        }}
        post={selectedPost}
      />
    </div>
  );
}
