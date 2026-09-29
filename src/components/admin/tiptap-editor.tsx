"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo } from "lucide-react";
import { useEffect } from "react";

interface TiptapEditorProps {
  value?: string; // HTML string
  onChange: (html: string, json: Record<string, unknown>) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  value = "",
  onChange,
  placeholder: _placeholder = "Write a comprehensive description...",
  className = "",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[160px] p-4 focus:outline-hidden text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange(html, json as Record<string, unknown>);
    },
  });

  // Sync external value changes (e.g. form reset or initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-40 rounded-2xl border border-border bg-card animate-pulse flex items-center justify-center text-xs text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden ${className}`}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("bold")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("italic")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("strike")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("bulletList")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Bullet List"
        >
          <List className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("orderedList")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("blockquote")
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Blockquote"
        >
          <Quote className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo className="size-3.5" />
        </button>
      </div>

      {/* Editor Surface */}
      <EditorContent editor={editor} />
    </div>
  );
}
