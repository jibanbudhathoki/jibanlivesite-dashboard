"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  RemoveFormatting,
  Code,
  Eye,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write narrative story content here...",
  minHeight = "120px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [localHtml, setLocalHtml] = useState(value || "");

  // Keep editor content in sync with external value if changed externally
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setLocalHtml(value || "");
  }, [value, isSourceMode]);

  const executeCommand = useCallback(
    (command: string, arg: string | undefined = undefined) => {
      if (isSourceMode) return;
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand(command, false, arg);
      if (editorRef.current) {
        const updated = editorRef.current.innerHTML;
        setLocalHtml(updated);
        onChange(updated);
      }
    },
    [isSourceMode, onChange]
  );

  const handleInput = () => {
    if (editorRef.current) {
      const updated = editorRef.current.innerHTML;
      setLocalHtml(updated);
      onChange(updated);
    }
  };

  const handleLink = () => {
    if (isSourceMode) return;
    const url = window.prompt("Enter link URL (e.g. https://example.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalHtml(val);
    onChange(val);
  };

  return (
    <div className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xs overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 p-1.5 text-gray-700 dark:text-gray-300 select-none">
        {/* Basic Styles */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("bold");
          }}
          disabled={isSourceMode}
          title="Bold (Ctrl+B)"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("italic");
          }}
          disabled={isSourceMode}
          title="Italic (Ctrl+I)"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("underline");
          }}
          disabled={isSourceMode}
          title="Underline (Ctrl+U)"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>

        <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Headings */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<h2>");
          }}
          disabled={isSourceMode}
          title="Subheading (H2)"
          className="rounded px-1.5 py-1 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          H2
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<h3>");
          }}
          disabled={isSourceMode}
          title="Small Heading (H3)"
          className="rounded px-1.5 py-1 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          H3
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<p>");
          }}
          disabled={isSourceMode}
          title="Normal Paragraph"
          className="rounded px-1.5 py-1 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          P
        </button>

        <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertUnorderedList");
          }}
          disabled={isSourceMode}
          title="Bullet List"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <List className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("insertOrderedList");
          }}
          disabled={isSourceMode}
          title="Numbered List"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("formatBlock", "<blockquote>");
          }}
          disabled={isSourceMode}
          title="Quote"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>

        <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Links */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleLink();
          }}
          disabled={isSourceMode}
          title="Insert Link"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("unlink");
          }}
          disabled={isSourceMode}
          title="Remove Link"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Unlink className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            executeCommand("removeFormat");
          }}
          disabled={isSourceMode}
          title="Clear Formatting"
          className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>

        {/* View Mode Toggle */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsSourceMode(!isSourceMode)}
            title={isSourceMode ? "Switch to Visual Editor" : "Switch to HTML Source"}
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isSourceMode ? (
              <>
                <Eye className="h-3.5 w-3.5 text-indigo-500" />
                <span>Visual</span>
              </>
            ) : (
              <>
                <Code className="h-3.5 w-3.5 text-gray-500" />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content Surface */}
      {isSourceMode ? (
        <textarea
          value={localHtml}
          onChange={handleSourceChange}
          placeholder="Edit raw HTML..."
          style={{ minHeight }}
          className="w-full bg-gray-50 dark:bg-gray-900 p-3 font-mono text-xs text-gray-800 dark:text-gray-200 focus:outline-hidden resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="p-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden leading-relaxed prose dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        />
      )}
    </div>
  );
}
