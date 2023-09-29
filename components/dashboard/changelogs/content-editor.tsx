'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
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
    content: data.content
      ? data.content
      : '<p>Write <em>styled</em> <mark>markdown</mark> in <strong>here</strong>.</p><p>Examples:</p><ul><li><p><code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different headings</p></li></ul><ul><li><p><code>==highlight==</code> for <mark>highlighted text</mark></p></li><li><p> <code>**bold**, *italic* and ~~strike~~</code> for <strong>bold</strong>,  <em>italic and <s>strike</s></em></p></li><li><p>and much more like  <code>(c)</code>, <code>-&gt;</code>, <code>&gt;&gt;</code>, <code>1/2</code>, <code>!=</code>, or <code>--</code></p></li></ul>',
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
      <div className='flex h-full flex-col rounded-md border'>
        <EditorContent editor={editor} className='p-0' />
      </div>
    </div>
  );
}
