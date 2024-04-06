'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CircleDashed, CircleX, LucideIcon, Plus, Tag, Tags, TextCursorInputIcon, X } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import { FeedbackTagProps } from '@/lib/types';

// Feedback Filter Props
export interface FeedbackFilterProps {
  tags: {
    i: FeedbackTagProps['Row'][];
    e: FeedbackTagProps['Row'][];
  };
  status: {
    i: { label: string; icon: LucideIcon }[];
    e: { label: string; icon: LucideIcon }[];
  };
  search: string;
  board: {
    i: string[];
    e: string[];
  };
  created_date: {
    b: string;
    a: string;
  };
  eta: {
    b: string;
    a: string;
  };
}

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

export default function FeedbackFilterHeader({ filters }: { filters: FeedbackFilterProps }) {
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  return (
    Object.values(filters).some((subObject) =>
      Object.values(subObject).some(
        (subValue) =>
          subValue !== null && subValue !== undefined && !(Array.isArray(subValue) && subValue.length === 0)
      )
    ) && (
      <div className='flex h-fit w-full flex-wrap items-center justify-start gap-2.5 border-b px-5 py-3 text-xs'>
        {/* Search */}
        {filters.search ? (
          <FeedbackFilter
            filter={{ icon: TextCursorInputIcon, label: 'Search' }}
            action={{
              label: filters.search.startsWith('!') ? 'excludes' : 'includes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                  onSelect: () => {
                    createQueryParams('search', filters.search.replaceAll('!', ''));
                  },
                },
                {
                  icon: CircleX,
                  label: 'Do not include',
                  onSelect: () => {
                    createQueryParams('search', `!${filters.search.replaceAll('!', '')}`);
                  },
                },
              ],
            }}
            appliedFilters={
              <span className='text-foreground px-2'>{filters.search.replaceAll('!', '')}</span>
            }
            onClear={() => {
              createQueryParams('search', '');
            }}
          />
        ) : null}

        {/* Included Tags */}
        {filters.tags && filters.tags.i.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: filters.tags.i.length > 1 ? Tags : Tag, label: 'Tags' }}
            action={{
              label: filters.tags.i.length > 1 ? 'includes all of' : 'includes',
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
                        ...filters.tags.e.map((tag) => `!${tag.name}`),
                        ...filters.tags.i.map((tag) => `!${tag.name}`),
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
                    {filters.tags.i.length > 0 &&
                      filters.tags.i.map((tag, index) => (
                        <div
                          key={tag?.name ?? index}
                          className='border-root -ml-2 h-2.5 w-2.5 rounded-full border-[1px]'
                          style={{
                            backgroundColor: tag?.color,
                            zIndex: filters.tags.i.length - index,
                          }}
                        />
                      ))}
                  </div>

                  {/* Tag name / count */}
                  {filters.tags.i.length > 1 ? (
                    <span>{filters.tags.i.length} Tags</span>
                  ) : (
                    <span>{filters.tags.i[0]?.name}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all included tags
              createQueryParams('tags', filters.tags.e.map((tag) => `!${tag.name}`).join(','));
            }}
          />
        ) : null}

        {/* Excluded Tags */}
        {filters.tags && filters.tags.e.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: filters.tags.e.length > 1 ? Tags : Tag, label: 'Tags' }}
            action={{
              label: filters.tags.e.length > 1 ? 'excludes all of' : 'excludes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                  onSelect: () => {
                    // Change all currently excluded tags to included
                    createQueryParams(
                      'tags',
                      [
                        ...filters.tags.i.map((tag) => tag.name),
                        ...filters.tags.e.map((tag) => `${tag.name}`),
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
                    {filters.tags.e.length > 0 &&
                      filters.tags.e.map((tag, index) => (
                        <div
                          key={tag?.name ?? index}
                          className='border-root -ml-2 h-2.5 w-2.5 rounded-full border-[1px]'
                          style={{
                            backgroundColor: tag?.color,
                            zIndex: filters.tags.e.length - index,
                          }}
                        />
                      ))}
                  </div>

                  {/* Tag name / count */}
                  {filters.tags.e.length > 1 ? (
                    <span>{filters.tags.e.length} Tags</span>
                  ) : (
                    <span>{filters.tags.e[0]?.name}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all excluded tags
              createQueryParams('tags', filters.tags.i.map((tag) => tag.name).join(','));
            }}
          />
        ) : null}

        {/* Included Statuses */}
        {filters.status && filters.status.i.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: CircleDashed, label: 'Status' }}
            action={{
              label: filters.status.i.length > 1 ? 'includes all of' : 'includes',
              options: [
                { icon: Plus, label: 'Include' },
                {
                  icon: CircleX,
                  label: 'Do not include',
                  onSelect: () => {
                    // Change all currently included statuses to excluded
                    createQueryParams(
                      'status',
                      [
                        ...filters.status.e.map((status) => `!${status.label}`),
                        ...filters.status.i.map((status) => `!${status.label}`),
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
                    {filters.status.i.length > 0 &&
                      filters.status.i.map((s, index) => (
                        <s.icon
                          key={s.label.toLowerCase()}
                          className='bg-root -ml-3 h-3.5 w-3.5 rounded-full'
                          style={{ zIndex: filters.status.i.length - index }}
                        />
                      ))}
                  </div>

                  {/* Labels */}
                  {filters.status.i.length > 1 ? (
                    <span>{filters.status.i.length} Statuses</span>
                  ) : (
                    <span>{filters.status.i[0].label}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all included statuses
              createQueryParams('status', filters.status.e.map((status) => `!${status.label}`).join(','));
            }}
          />
        ) : null}

        {/* Excluded Statuses */}
        {filters.status && filters.status.e.length > 0 ? (
          <FeedbackFilter
            filter={{ icon: CircleDashed, label: 'Status' }}
            action={{
              label: filters.status.e.length > 1 ? 'excludes all of' : 'excludes',
              options: [
                {
                  icon: Plus,
                  label: 'Include',
                  onSelect: () => {
                    // Change all currently excluded statuses to included
                    createQueryParams(
                      'status',
                      [
                        ...filters.status.i.map((status) => status.label),
                        ...filters.status.e.map((status) => `${status.label}`),
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
                  {/* Overlapping icons */}
                  <div className='flex flex-row gap-1 pl-3'>
                    {filters.status.e.length > 0 &&
                      filters.status.e.map((s, index) => (
                        <s.icon
                          key={s.label.toLowerCase()}
                          className='bg-root -ml-3 h-3.5 w-3.5 rounded-full'
                          style={{ zIndex: filters.status.e.length - index }}
                        />
                      ))}
                  </div>

                  {/* Label */}
                  {filters.status.e.length > 1 ? (
                    <span>{filters.status.e.length} Statuses</span>
                  ) : (
                    <span>{filters.status.e[0].label}</span>
                  )}
                </div>
              </span>
            }
            onClear={() => {
              // Clear all excluded statuses
              createQueryParams('status', filters.status.i.map((status) => status.label).join(','));
            }}
          />
        ) : null}
      </div>
    )
  );
}
