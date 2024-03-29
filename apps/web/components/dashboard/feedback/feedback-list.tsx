'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@ui/components/ui/label';
import { Separator } from '@ui/components/ui/separator';
import { Skeleton } from '@ui/components/ui/skeleton';
import { cn } from '@ui/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Info,
  XCircle,
} from 'lucide-react';
import useSWR from 'swr';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { Button } from 'ui/components/ui/button';
import useCreateQueryString from '@/lib/hooks/use-create-query';
import { FeedbackWithUserProps } from '@/lib/types';
import { fetcher } from '@/lib/utils';
import { FeedbackSheet } from './feedback-sheet';
import { statusOptions } from './status-combobox';

type DateSortedFeedbackProps = Record<string, FeedbackWithUserProps[]>;

export default function FeedbackList({}: {}) {
  const searchParams = useSearchParams();
  const createQueryString: (name: string, value: string) => string = useCreateQueryString(searchParams);
  const pathname = usePathname();
  const projectSlug = pathname.split('/')[1];
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const {
    data: feedbackList,
    error,
    isLoading,
    mutate,
  } = useSWR<FeedbackWithUserProps[]>(`/api/v1/projects/${projectSlug}/feedback`, fetcher);

  // Query params
  const tag = searchParams.get('tags') || '';
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  // Filter feedback by query params if they exist
  const filteredFeedback =
    feedbackList
      ?.filter((feedback) => {
        // Filter by tab
        if (tab !== 'all' && feedback.status?.toLowerCase() !== tab) return false;

        // Filter by search
        if (search && !feedback.title.toLowerCase().includes(search.toLowerCase())) return false;

        // Filter by tag/tags, if tags are multiple then they are separated by comma
        if (tag && !tag.split(',').every((t) => feedback.tags?.some((ft) => ft.name.toLowerCase() === t)))
          return false;

        // Filter by status
        if (status && !feedback.status?.toLowerCase().includes(status.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  // This should first sort all the feedback by date newest first and then split them up into 'XX Month' format for the feedback in last 7 days, from last 7 days to last 30 it should be 'Last 7 days' and 'Last 30 days' and then 'Older'
  const dateSortedFeedback: DateSortedFeedbackProps = filteredFeedback.reduce<DateSortedFeedbackProps>(
    (acc, feedback) => {
      const feedbackDate = new Date(feedback.created_at);
      const diffInDays = Math.floor((new Date().getTime() - feedbackDate.getTime()) / (1000 * 3600 * 24));

      let dateKey;
      if (diffInDays <= 7) {
        dateKey = formatDate(feedbackDate); // Format as XX Mon
      } else if (diffInDays <= 14) {
        dateKey = 'Last 14 days';
      } else if (diffInDays <= 30) {
        dateKey = 'Last 30 days';
      } else {
        dateKey = 'Older';
      }

      return {
        ...acc,
        [dateKey]: [...(acc[dateKey] || []), feedback],
      };
    },
    {}
  );

  // Calc date in format: 15 Aug
  function formatDate(date: Date) {
    const day = date.getDate().toString();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    return `${day} ${month}`;
  }

  return (
    <>
      {/* Header tabs */}
      <div className='z-10 -mb-[1px] flex w-full flex-row items-center justify-start gap-2.5 px-5 pt-3'>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'all' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('all');
          }}>
          All
        </Button>

        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'in-review' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('in-review');
          }}>
          <CircleDashed className='h-4 w-4' />
          In Review
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'planned' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('planned');
          }}>
          <CircleDotDashed className='h-4 w-4' />
          Planned
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'in-progress' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('in-progress');
          }}>
          <CircleDot className='h-4 w-4' />
          In Progress
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'completed' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('completed');
          }}>
          <CheckCircle2 className='h-4 w-4' />
          Completed
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'rejected' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('rejected');
          }}>
          <XCircle className='h-4 w-4' />
          Rejected
        </Button>
      </div>

      <Separator />

      <div className='flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto p-5'>
        {/* Loading Skeleton */}
        {isLoading && (
          <div className='flex w-full flex-col'>
            {Array.from({ length: Math.floor(Math.random() * 5) + 5 }).map((_, index) => (
              <div
                className='flex h-12 w-full flex-row items-center justify-between border border-b-0 p-1 px-2 [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
                key={`item-${index}`}>
                <div className='flex w-full items-center gap-2 pr-10'>
                  <Skeleton className='h-6 w-6' />
                  <Skeleton className='h-6 w-full' />
                </div>

                <div className='flex items-center gap-2'>
                  {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, innerIndex) => (
                    <Skeleton key={`inner-item-${innerIndex}`} className='h-6 w-12 rounded-full' />
                  ))}
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <Skeleton className='h-4 w-10' />
                  <Skeleton className='h-6 w-6 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className='flex flex-col items-center gap-2 p-10'>
            <AlertCircle className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
            <div className='space-y-1.5 text-center'>
              <div className='text-secondary-foreground text-center'>
                Failed to load feedback. Please try again.
              </div>
              {/* Detailed error message */}
              {(() => {
                try {
                  return (
                    <p className='text-muted-foreground text-center'>{JSON.parse(error.message)?.error}</p>
                  );
                } catch (parseError) {
                  return null;
                }
              })()}
            </div>
            <Button size='sm' variant='secondary' onClick={() => mutate()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredFeedback.length === 0 && !isLoading && !error && (
          <div className='flex flex-col items-center gap-2 p-10'>
            <Info className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
            <div className='space-y-1.5 text-center'>
              <div className='text-secondary-foreground text-center'>
                No feedback found. Try changing the filters.
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <Button
                size='sm'
                variant='secondary'
                onClick={() => {
                  mutate();
                }}>
                Refresh
              </Button>
              <Button size='sm' variant='default'>
                Create Post
              </Button>
            </div>
          </div>
        )}

        {/* If filteredFeedback is not empty */}
        {Object.entries(dateSortedFeedback).map(([key, value]) => {
          return (
            <div key={key} className='flex w-full flex-col gap-2'>
              <Label>{key}</Label>
              <div>
                {value.map((feedback) => (
                  <FeedbackSheet key={feedback.id} feedback={filteredFeedback} initialFeedback={feedback}>
                    <div
                      className='jusify-between hover:bg-muted/50 group flex h-12 cursor-pointer flex-row items-center border border-b-0 p-1 transition-all [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
                      key={feedback.id}>
                      {/* Upvotes & Title */}
                      <div className='flex h-full w-full min-w-0 flex-row items-center'>
                        {/* Upvotes */}
                        <div className='flex h-11 flex-col items-center justify-center rounded-sm px-2 py-1 '>
                          {/* Arrow */}
                          <ChevronUp
                            className={cn(
                              ' h-4 w-4 shrink-0 text-sm transition-colors',
                              feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                            )}
                          />

                          {/* Upvotes */}
                          <div
                            className={cn(
                              ' -mt-[5px]  text-sm transition-colors',
                              feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                            )}>
                            {feedback.upvotes}
                          </div>
                        </div>

                        <span className='text-foreground line-clamp-1 pr-1 text-[15px] transition-all'>
                          {feedback.title}
                        </span>
                      </div>

                      {/* Tags & User */}
                      <div className='mr-2 flex flex-shrink-0 items-center gap-2'>
                        {/* Tags */}
                        {feedback.tags && feedback.tags.length > 0
                          ? feedback.tags.map((tag) => (
                              <button
                                className=' group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors hover:cursor-pointer md:flex'
                                key={tag.name.toLowerCase()}
                                type='button'
                                onClick={(e) => {
                                  // Prevent sheet from opening
                                  e.stopPropagation();

                                  // If already selected, remove the tag
                                  if (tag.name.toLowerCase() === searchParams.get('tags')) {
                                    router.push(`${pathname}?${createQueryString('tags', '')}`);
                                    return;
                                  }

                                  router.push(`${pathname}?${createQueryString('tags', tag.name)}`);
                                }}>
                                {/* Tag color */}
                                <div
                                  className='h-2 w-2 rounded-full'
                                  style={{ backgroundColor: tag.color }}
                                />
                                {/* Tag name */}
                                <div className='text-foreground/60 group-hover/tag:text-foreground/80 text-xs  transition-colors'>
                                  {tag.name}
                                </div>
                              </button>
                            ))
                          : null}

                        <div className='flex flex-shrink-0 items-center gap-2'>
                          {/* Status Icon */}
                          {(() => {
                            if (feedback.status) {
                              const currentStatus =
                                statusOptions.find(
                                  (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                                ) || statusOptions[0];

                              return (
                                <button
                                  className='group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border p-1 transition-colors hover:cursor-pointer md:flex'
                                  type='button'
                                  onClick={(e) => {
                                    // Prevent sheet from opening
                                    e.stopPropagation();

                                    // If already selected, remove the status
                                    if (currentStatus.label.toLowerCase() === searchParams.get('status')) {
                                      router.push(`${pathname}?${createQueryString('status', '')}`);
                                      return;
                                    }

                                    router.push(
                                      `${pathname}?${createQueryString('status', currentStatus.label)}`
                                    );
                                  }}>
                                  <currentStatus.icon className='text-foreground/60 h-4 w-4' />
                                </button>
                              );
                            }
                            return null;
                          })()}

                          {/* Date */}
                          <div className='text-foreground/50 cursor-default select-none text-center text-xs font-light'>
                            {formatDate(new Date(feedback.created_at))}
                          </div>

                          {/* User */}
                          <Avatar className='h-6 w-6 gap-2 border'>
                            <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
                            <AvatarFallback>{feedback.user.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  </FeedbackSheet>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}