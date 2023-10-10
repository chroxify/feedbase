'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { Typography } from '@tiptap/extension-typography';
import React from 'react';
import TooltipLabel from '@/components/shared/tooltip-label';
import { ChangelogProps } from '@/lib/types';

export default function RichTextEditor({
  data,
  setData,
}: {
  data: ChangelogProps['Row'];
  setData: React.Dispatch<React.SetStateAction<ChangelogProps['Row']>>;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography],
    content: data.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert m-5 focus:outline-none',
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
