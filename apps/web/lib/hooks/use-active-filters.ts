'use client';

import { ReadonlyURLSearchParams } from 'next/navigation';
import { FeedbackFilterProps, FeedbackTagProps } from '@/lib/types';
import { STATUS_OPTIONS } from '../constants';

export function useActiveFilters(
  searchParams: ReadonlyURLSearchParams,
  workspaceTags: FeedbackTagProps['Row'][] | undefined
): FeedbackFilterProps {
  const filters = {
    tags: searchParams.get('tags') ?? '',
    status: searchParams.get('status') ?? '',
    search: searchParams.get('search') ?? '',
  };

  const feedbackFilters: FeedbackFilterProps = {
    tags: {
      i:
        workspaceTags?.filter((tag) => {
          return filters.tags.split(',').includes(tag.name.toLowerCase());
        }) ?? [],
      e:
        workspaceTags?.filter((tag) => {
          return filters.tags.split(',').includes(`!${tag.name.toLowerCase()}`);
        }) ?? [],
    },
    status: {
      i:
        filters.status
          .split(',')
          .map((s) => {
            if (!s.startsWith('!')) {
              return STATUS_OPTIONS.find(
                (option) => option.label.toLowerCase() === s.replace('!', '').replace('+', ' ').toLowerCase()
              );
            }
            return null;
          })
          .filter(Boolean) ?? [],
      e:
        filters.status
          .split(',')
          .map((s) => {
            if (s.startsWith('!')) {
              return STATUS_OPTIONS.find(
                (option) => option.label.toLowerCase() === s.replace('!', '').replace('+', ' ').toLowerCase()
              );
            }
            return null;
          })
          .filter(Boolean) ?? [],
    },
    search: filters.search,
  } as FeedbackFilterProps;

  return feedbackFilters;
}
