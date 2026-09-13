"use client";

import React, { useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Check,
  RotateCw,
  X,
  ExternalLink,
  Inbox,
  Clock,
  User,
  Search,
} from "lucide-react";
import {
  useMessagesQuery,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
} from "../hooks/useMessages";
import { ContactMessage } from "../types";

export function MessagesList() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data, isLoading, isFetching, refetch } = useMessagesQuery(unreadOnly);
  const markReadMutation = useMarkMessageReadMutation();
  const deleteMutation = useDeleteMessageMutation();

  const messages = data?.data || [];
  const meta = data?.meta || { total: 0, unread: 0 };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markReadMutation.mutate(msg.id);
    }
  };

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markReadMutation.mutate(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inbox Messages
            </h2>
            {meta.unread > 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {meta.unread} New
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Messages submitted by visitors through the portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnreadOnly(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              !unreadOnly
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All Messages ({meta.total})
          </button>
          <button
            type="button"
            onClick={() => setUnreadOnly(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              unreadOnly
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span>Unread Only</span>
            {meta.unread > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-xs text-gray-900 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Messages List / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-800 p-12 text-center bg-gray-50/50 dark:bg-gray-900/20">
          <Inbox className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            No messages found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {unreadOnly
              ? "You have caught up with all messages! No unread inquiries."
              : searchQuery
              ? "No messages match your search filter."
              : "When a visitor fills out the contact form on your portfolio, their message will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 shadow-xs divide-y divide-gray-100 dark:divide-gray-800">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/90 transition-colors ${
                !msg.isRead
                  ? "bg-blue-50/30 dark:bg-blue-950/10 font-medium"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {/* Left Column: Indicator, Name & Message Preview */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Status indicator dot */}
                <div className="pt-1 shrink-0">
                  {!msg.isRead ? (
                    <span
                      className="block h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"
                      title="Unread"
                    />
                  ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm ${
                        !msg.isRead
                          ? "font-bold text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>

                  {msg.subject && (
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {msg.subject}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Right Column: Date & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {formatDate(msg.createdAt)}
                </span>

                <div className="flex items-center gap-1">
                  {!msg.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkRead(e, msg.id)}
                      title="Mark as Read"
                      className="rounded p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, msg.id)}
                    title="Delete Message"
                    className="rounded p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Reading Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {selectedMessage.subject || "Contact Message"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Received {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Sender Details Card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {selectedMessage.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {selectedMessage.ip && (
                  <div className="text-[11px] text-gray-400 font-mono">
                    Sender IP: {selectedMessage.ip}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Message Content
                </label>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 p-5 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed shadow-2xs font-sans">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-800/40">
              <button
                type="button"
                onClick={(e) => handleDelete(e, selectedMessage.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || "Your message to Jiban Budhathoki"
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
