'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { cn } from '@feedbase/ui/lib/utils';
import { CircleDashed, CircleX, LucideIcon, Plus, Tag, Tags, TextCursorInputIcon, X } from 'lucide-react';
import { KeyedMutator } from 'swr';
import { useActiveFilters } from '@/lib/hooks/use-active-filters';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useTags from '@/lib/swr/use-tags';
import { FeedbackFilterProps, FeedbackWithUserProps } from '@/lib/types';

// Filter Action Dropdown Option Props
interface FilterActionDropdownOptions {
  icon: LucideIcon;
  label: string;
  onSelect?: () => void;
}

// Filter Action Dropdown
function FilterActionDropdown({
  children,
  options,
}: {
  children: React.ReactNode;
  options: FilterActionDropdownOptions[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option.label} className='flex gap-1.5' onSelect={option.onSelect}>
            <option.icon className='text-foreground/60 group-hover:text-foreground h-4 w-4 transition-colors' />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Feedback Filter Component
function FeedbackFilter({
  filter,
  action,
  appliedFilters,
  onClear,
}: {
  filter: { icon: LucideIcon; label: string };
  action: { label: string; options: FilterActionDropdownOptions[] };
  appliedFilters: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <div className='flex h-6 items-center rounded-md border'>
      <span className='text-foreground inline-flex items-center gap-1.5 px-2'>
        <filter.icon className='text-muted-foreground h-3.5 w-3.5' />
        {filter.label}
      </span>
      <FilterActionDropdown options={action.options}>
        <Button
          variant='ghost'
          className='text-secondary-foreground dark:text-muted-foreground dark:hover:text-foreground hover:text-foreground h-full rounded-none border-x px-2 text-xs font-normal'>
          {action.label}
        </Button>
      </FilterActionDropdown>
      {appliedFilters}
      <Button
        size='sm'
        variant='ghost'
        className='text-muted-foreground hover:text-foreground h-full rounded-none border-l px-1.5 font-normal'
        onClick={onClear}>
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
}

// Filter Feedback Helper Function
export function FilterFeedback(feedbackList: FeedbackWithUserProps[], tab?: string): FeedbackWithUserProps[] {
  const { tags } = useTags();
  const feedbackFilters = useActiveFilters(useSearchParams(), tags);

  return feedbackList.filter((feedback) => {
    // Filter by tab
    if (tab && tab !== 'All' && feedback.status?.toLowerCase() !== tab.toLowerCase()) return false;

    // Filter by search
    if (feedbackFilters.search) {
      // Include feedback if it doesn't have '!' in front of the search
      if (!feedbackFilters.search.startsWith('!')) {
        if (!feedback.title.toLowerCase().includes(feedbackFilters.search.toLowerCase())) {
          return false;
        }
      } else if (feedback.title.toLowerCase().includes(feedbackFilters.search.slice(1).toLowerCase())) {
        return false;
      }
    }

    // Filter by tag/tags
    if (feedbackFilters.tags.i.length > 0 || feedbackFilters.tags.e.length > 0) {
      if (
        feedbackFilters.tags.i.length > 0 &&
        !feedbackFilters.tags.i.some(
          (tag) => feedback.tags?.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())
        )
      ) {
        return false;
      }

      if (
        feedbackFilters.tags.e.length > 0 &&
        feedbackFilters.tags.e.some(
          (tag) => feedback.tags?.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // Filter by status
    if (feedbackFilters.status.i.length > 0 || feedbackFilters.status.e.length > 0) {
      // Include feedback if it doesn't have '!' in front of the status
      if (
        feedbackFilters.status.i.length > 0 &&
        !feedbackFilters.status.i.some((s) => feedback.status?.toLowerCase() === s.label.toLowerCase())
      ) {
        return false;
      }

      // Exclude feedback if it has '!' in front of the status
      if (
        feedbackFilters.status.e.length > 0 &&
        feedbackFilters.status.e.some((s) => feedback.status?.toLowerCase() === s.label.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });
}

export default function FeedbackFilterHeader({
  mutate,
  className,
}: {
  mutate: KeyedMutator<FeedbackWithUserProps[]>;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);
  const [feedbackFilters, setFeedbackFilters] = useState<FeedbackFilterProps | null>(null);
  const { tags: workspaceTags } = useTags();
  const activeFilters = useActiveFilters(searchParams, workspaceTags);

  // Handle filter changes
  useEffect(() => {
    // Mutate data with complete revalidation
    mutate(undefined, { revalidate: true });

    // Set feedback filters
    setFeedbackFilters(activeFilters);
  }, [searchParams, mutate]);

  if (!feedbackFilters) return null;

  return (
    Object.values(feedbackFilters).some((subObject) =>
      Object.values(subObject).some(
        (subValue) =>
          subValue !== null && subValue !== undefined && !(Array.isArray(subValue) && subValue.length === 0)
      )
    ) && (
      <div
        className={cn(
          'flex h-fit w-full flex-wrap items-center justify-start gap-2.5 py-3 text-xs',
          className
        )}>
        {/* Search */}
        {feedbackFilters.search ? (
          <FeedbackFilter
            filter={{ icon: TextCursorInputIcon, label: 'Search' }}
            action={{
              label: feedbackFilters.search.startsWith('!') ? 'excludes' : 'includes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                  onSelect: () => {
                    createQueryParams('search', feedbackFilters.search.replaceAll('!', ''));
                  },
                },
                {
                  icon: CircleX,
                  label: 'Do not include',
                  onSelect: () => {
                    createQueryParams('search', `!${feedbackFilters.search.replaceAll('!', '')}`);
                  },
                },
              ],
            }}
            appliedFilters={
              <span className='text-foreground px-2'>{feedbackFilters.search.replaceAll('!', '')}</span>
            }
            onClear={() => {
              createQueryParams('search', '');
            }}
          />
        ) : null}

        {/* Included Tags */}
        {feedbackFilters.tags && feedbackFilters.tags.i.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: feedbackFilters.tags.i.length > 1 ? Tags : Tag, label: 'Tags' }}
            action={{
              label: feedbackFilters.tags.i.length > 1 ? 'includes all of' : 'includes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                },
                {
                  icon: CircleX,
                  label: 'Do not include',
                  onSelect: () => {
                    // Change all currently included tags to excluded
                    createQueryParams(
                      'tags',
                      [
                        ...feedbackFilters.tags.e.map((tag) => `!${tag.name}`),
                        ...feedbackFilters.tags.i.map((tag) => `!${tag.name}`),
                      ].join(',')
                    );
                  },
                },
              ],
            }}
            appliedFilters={
              <span className='text-foreground select-none px-2'>
                <div className='flex flex-row items-center justify-center gap-1.5'>
                  {/* Overlapping colors */}
                  <div className='flex flex-row gap-1 pl-2'>
                    {feedbackFilters.tags.i.length > 0 &&
                      feedbackFilters.tags.i.map((tag, index) => (
                        <div
                          key={tag?.name ?? index}
                          className='border-root -ml-2 h-2.5 w-2.5 rounded-full border-[1px]'
                          style={{
                            backgroundColor: tag?.color,
                            zIndex: feedbackFilters.tags.i.length - index,
                          }}
                        />
                      ))}
                  </div>

                  {/* Tag name / count */}
                  {feedbackFilters.tags.i.length > 1 ? (
                    <span>{feedbackFilters.tags.i.length} Tags</span>
                  ) : (
                    <span>{feedbackFilters.tags.i[0]?.name}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all included tags
              createQueryParams('tags', feedbackFilters.tags.e.map((tag) => `!${tag.name}`).join(','));
            }}
          />
        ) : null}

        {/* Excluded Tags */}
        {feedbackFilters.tags && feedbackFilters.tags.e.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: feedbackFilters.tags.e.length > 1 ? Tags : Tag, label: 'Tags' }}
            action={{
              label: feedbackFilters.tags.e.length > 1 ? 'excludes all of' : 'excludes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                  onSelect: () => {
                    // Change all currently excluded tags to included
                    createQueryParams(
                      'tags',
                      [
                        ...feedbackFilters.tags.i.map((tag) => tag.name),
                        ...feedbackFilters.tags.e.map((tag) => `${tag.name}`),
                      ].join(',')
                    );
                  },
                },
                { icon: CircleX, label: 'Do not include' },
              ],
            }}
            appliedFilters={
              <span className='text-foreground select-none px-2'>
                <div className='flex flex-row items-center justify-center gap-1.5'>
                  {/* Overlapping colors */}
                  <div className='flex flex-row gap-1 pl-2'>
                    {feedbackFilters.tags.e.length > 0 &&
                      feedbackFilters.tags.e.map((tag, index) => (
                        <div
                          key={tag?.name ?? index}
                          className='border-root -ml-2 h-2.5 w-2.5 rounded-full border-[1px]'
                          style={{
                            backgroundColor: tag?.color,
                            zIndex: feedbackFilters.tags.e.length - index,
                          }}
                        />
                      ))}
                  </div>

                  {/* Tag name / count */}
                  {feedbackFilters.tags.e.length > 1 ? (
                    <span>{feedbackFilters.tags.e.length} Tags</span>
                  ) : (
                    <span>{feedbackFilters.tags.e[0]?.name}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all excluded tags
              createQueryParams('tags', feedbackFilters.tags.i.map((tag) => tag.name).join(','));
            }}
          />
        ) : null}

        {/* Included Statuses */}
        {feedbackFilters.status && feedbackFilters.status.i.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: CircleDashed, label: 'Status' }}
            action={{
              label: feedbackFilters.status.i.length > 1 ? 'is any of' : 'is',
              options: [
                { icon: Plus, label: 'Is' },
                {
                  icon: CircleX,
                  label: 'Is not',
                  onSelect: () => {
                    // Change all currently included statuses to excluded
                    createQueryParams(
                      'status',
                      [
                        ...feedbackFilters.status.e.map((status) => `!${status.label}`),
                        ...feedbackFilters.status.i.map((status) => `!${status.label}`),
                      ].join(',')
                    );
                  },
                },
              ],
            }}
            appliedFilters={
              <span className='text-foreground select-none px-2'>
                <div className='flex flex-row items-center justify-center gap-1.5'>
                  {/* Overlapping icons */}
                  <div className='flex flex-row gap-1 pl-3'>
                    {feedbackFilters.status.i.length > 0 &&
                      feedbackFilters.status.i.map((s, index) => (
                        <s.icon
                          key={s.label.toLowerCase()}
                          className='bg-root -ml-3 h-3.5 w-3.5 rounded-full'
                          style={{ zIndex: feedbackFilters.status.i.length - index }}
                        />
                      ))}
                  </div>

                  {/* Labels */}
                  {feedbackFilters.status.i.length > 1 ? (
                    <span>{feedbackFilters.status.i.length} Statuses</span>
                  ) : (
                    <span>{feedbackFilters.status.i[0].label}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all included statuses
              createQueryParams(
                'status',
                feedbackFilters.status.e.map((status) => `!${status.label}`).join(',')
              );
            }}
          />
        ) : null}

        {/* Excluded Statuses */}
        {feedbackFilters.status && feedbackFilters.status.e.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: CircleDashed, label: 'Status' }}
            action={{
              label: 'is not',
              options: [
                {
                  icon: Plus,
                  label: 'Is',
                  onSelect: () => {
                    // Change all currently excluded statuses to included
                    createQueryParams(
                      'status',
                      [
                        ...feedbackFilters.status.i.map((status) => status.label),
                        ...feedbackFilters.status.e.map((status) => `${status.label}`),
                      ].join(',')
                    );
                  },
                },
                { icon: CircleX, label: 'Is not' },
              ],
            }}
            appliedFilters={
              <span className='text-foreground select-none px-2'>
                <div className='flex flex-row items-center justify-center gap-1.5'>
                  {/* Overlapping icons */}
                  <div className='flex flex-row gap-1 pl-3'>
                    {feedbackFilters.status.e.length > 0 &&
                      feedbackFilters.status.e.map((s, index) => (
                        <s.icon
                          key={s.label.toLowerCase()}
                          className='bg-root -ml-3 h-3.5 w-3.5 rounded-full'
                          style={{ zIndex: feedbackFilters.status.e.length - index }}
                        />
                      ))}
                  </div>

                  {/* Label */}
                  {feedbackFilters.status.e.length > 1 ? (
                    <span>{feedbackFilters.status.e.length} Statuses</span>
                  ) : (
                    <span>{feedbackFilters.status.e[0].label}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all excluded statuses
              createQueryParams('status', feedbackFilters.status.i.map((status) => status.label).join(','));
            }}
          />
        ) : null}
      </div>
    )
  );
}
