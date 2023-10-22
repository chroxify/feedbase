'use client';

import './placeholder.css';
import React from 'react';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { cn } from '@ui/lib/utils';

export default function RichTextEditor({
  content,
  setContent,
  placeholder,
  className,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none',
        tabindex: '-1',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <EditorContent
      editor={editor}
      className={cn('h-full w-full p-0 text-sm font-light outline-none', className)}
    />
  );
}
