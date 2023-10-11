'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from 'ui/components/ui/input';
import useCreateQueryString from '@/lib/hooks/use-create-query';
import { FeedbackTagProps } from '@/lib/types';
import { SearchIcon } from '@/components/shared/icons/icons-animated';
import LottiePlayer from '@/components/shared/lottie-player';
import { StatusCombobox } from './status-combobox';
import { TagCombobox } from './tag-combobox';

export default function FeedbackHeader({ tags }: { tags: FeedbackTagProps['Row'][] }) {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const [animate, setAnimate] = useState(false);

  // Create comboTags array from tags: { value: name.toLowerCase(), label: name }
  const comboTags = tags.map((tag) => {
    return {
      value: tag.name.toLowerCase(),
      label: tag.name,
      color: tag.color,
    };
  });

  return (
    <div className='flex w-full flex-col-reverse items-center justify-end gap-2 sm:h-12 sm:flex-row'>
      {/* Search */}
      <div
        className='relative flex w-full items-center justify-end sm:w-72'
        // On focus, animate the search icon
        onFocus={() => {
          setAnimate(true);
        }}
        onBlur={() => {
          setAnimate(false);
        }}>
        {/* Input */}
        <Input
          placeholder='Search feedback'
          className='h-8 w-full px-7'
          onChange={(e) => {
            router.push(`${pathname}?${createQueryString('search', e.target.value)}`);
          }}
        />

        {/* Icon */}
        <LottiePlayer
          lottieSrc={SearchIcon}
          animate={animate}
          className='text-foreground/70 absolute left-2 h-4 w-4'
        />
      </div>

      {/* Filter buttons */}
      <div className='flex w-full flex-row items-center justify-end gap-2 sm:w-fit'>
        {/* Status */}
        <StatusCombobox
          initialValue={searchParams.get('status')}
          onSelect={(status) => {
            router.push(`${pathname}?${createQueryString('status', status)}`);
          }}
        />

        {/* Tags */}
        <TagCombobox
          projectTags={comboTags}
          initialValue={searchParams.get('tags')?.split(',')}
          onSelect={(tag) => {
            router.push(`${pathname}?${createQueryString('tags', tag.join(','))}`);
          }}
        />
      </div>
    </div>
  );
}
