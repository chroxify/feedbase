'use client';

import React from 'react';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';
import { AnyExtension, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { ChangelogProps } from '@/lib/types';
import TooltipLabel from '@/components/shared/tooltip-label';

export default function RichTextEditor({
  data,
  setData,
}: {
  data: ChangelogProps['Row'];
  setData: React.Dispatch<React.SetStateAction<ChangelogProps['Row']>>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
      Highlight,
      Link.configure({
        HTMLAttributes: {
          class: 'cursor-pointer',
        },
      }),
      Typography,
    ],
    content: data.content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base dark:prose-invert m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setData({ ...data, content: editor.getHTML() });
    },
  });

  return (
    <div className='flex h-full flex-col gap-2'>
      <TooltipLabel label='Content' tooltip='The content of your changelog.' />
      <div className='flex h-full max-h-96 flex-col overflow-auto rounded-md border text-sm font-extralight'>
        <EditorContent editor={editor} className='p-0' />
      </div>
    </div>
  );
}
