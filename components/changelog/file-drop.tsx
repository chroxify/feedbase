'use client';

/*
  This component is a modified version of Steven Tey's OGSection component from the dub project.
  Big shoutout to him for making this component open source!
  Credits: https://github.com/steven-tey/dub/blob/23cea302493a2e240fb31a75d3bf0da3979a0abc/components/app/modals/add-edit-link-modal/og-section.tsx#L4
*/

import { Dispatch, useCallback, useState } from 'react';
import TooltipLabel from '../ui/tooltip-label';
import Image from 'next/image';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { ChangelogProps } from '@/lib/types';

export default function FileDrop({
  data,
  setData,
}: {
  data: ChangelogProps['Row'];
  setData: Dispatch<React.SetStateAction<ChangelogProps['Row']>>;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (e: any) => {
      setFileError(null);
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileError('File size too big (max 5MB)');
        } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
          setFileError('File type not supported.');
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData]
  );

  return (
    <div className='h-full'>
      <div className='flex items-center justify-between'>
        <TooltipLabel
          label='Image'
          tooltip='This image will be used as the preview image for your changelog.'
        />
        {fileError && <p className='text-sm text-destructive'>{fileError}</p>}
      </div>
      {/* BUG: Fix this so that its not a fixed height but rather just takes over full height properly */}
      {/* As currently it is not on the same level as the other inputs */}
      <label
        htmlFor='image'
        className='group relative mt-1 flex h-[10rem] cursor-pointer flex-col items-center justify-center rounded-md border border-input bg-background shadow-sm transition-all hover:bg-accent'>
        <div
          className='absolute z-[5] h-full w-full rounded-md'
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            setFileError(null);
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            if (file) {
              if (file.size / 1024 / 1024 > 5) {
                setFileError('File size too big (max 5MB)');
              } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                setFileError('File type not supported.');
              } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setData((prev) => ({
                    ...prev,
                    image: e.target?.result as string,
                  }));
                };
                reader.readAsDataURL(file);
              }
            }
          }}
        />
        <div
          className={`${
            dragActive ? 'cursor-copy border-2 border-foreground bg-background opacity-100' : ''
          } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md bg-background transition-all ${
            data.image ? 'opacity-0 group-hover:opacity-100' : 'group-hover:bg-accent'
          }`}>
          <CloudArrowUpIcon
            className={`${
              dragActive ? 'scale-110' : 'scale-100'
            } h-7 w-7 text-foreground/60 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
          />
          <p className='mt-2 text-center text-sm text-foreground/60'>Drag and drop or click to upload.</p>
          <p className='mt-2 text-center text-sm text-foreground/60'>Recommended: 1200 x 630 pixels</p>
          <span className='sr-only'>OG image upload</span>
        </div>
        {data.image && (
          <Image src={data.image} alt='Preview' fill className='h-full w-full rounded-md object-cover' />
        )}
      </label>
      <div className='mt-1 flex rounded-md shadow-sm'>
        <input
          id='image'
          name='image'
          type='file'
          accept='image/*'
          className='sr-only'
          onChange={onChangePicture}
        />
      </div>
    </div>
  );
}
