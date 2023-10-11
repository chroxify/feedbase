'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronUp } from 'lucide-react';
import { FeedbackTagProps, FeedbackWithUserProps } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FeedbackModal from '../modals/view-feedback-modal';
import { statusOptions } from './status-combobox';
import useCreateQueryString from '@/lib/hooks/use-create-query';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FeedbackTable({
  fetchedFeedback,
  tags,
}: {
  fetchedFeedback: FeedbackWithUserProps[];
  tags: FeedbackTagProps['Row'][];
}) {
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);
  const pathname = usePathname();
  const projectSlug = pathname.split('/')[1];
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<FeedbackWithUserProps[]>(fetchedFeedback);

  // Query params
  const tag = searchParams.get('tags') || '';
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  // Filter feedback by query params if they exist
  const filteredFeedback = feedbackList.filter((feedback) => {
    // Filter by search
    if (search && !feedback.title.toLowerCase().includes(search.toLowerCase())) return false;

    // Filter by tag/tags, if tags are multiple then they are separated by comma
    if (tag && !tag.split(',').every((t) => feedback.tags?.some((ft) => ft.name.toLowerCase() === t)))
      return false;

    // Filter by status
    if (status && !feedback.status?.toLowerCase().includes(status.toLowerCase())) return false;
    return true;
  });

  // Calc date in format: 15 Aug
  const formatDate = (date: Date) => {
    const day = date.getDate().toString();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    return `${day} ${month}`;
  };

  // Upvote feedback
  function onUpvoteTag(feedback: FeedbackWithUserProps) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedback.id}/upvotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        // Get index of feedback
        const index = feedbackList.findIndex((fb) => fb.id === feedback.id);

        // Update feedbackList
        const newFeedbackList = [...feedbackList];

        // Update feedback
        newFeedbackList[index].has_upvoted = !feedback.has_upvoted;

        // Update upvotes
        newFeedbackList[index].upvotes = feedback.upvotes + (feedback.has_upvoted ? 1 : -1);

        // Set feedbackList
        setFeedbackList(newFeedbackList);
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  return (
    <div className='flex w-full flex-col overflow-y-auto'>
      {/* If filteredFeedback is empty */}
      {filteredFeedback.length === 0 && (
        <Card className=' flex w-full flex-col items-center justify-center p-10 sm:p-20'>
          <CardHeader className='items-center text-center '>
            <CardTitle className='text-2xl font-medium'>No feedback matches your search</CardTitle>
            <CardDescription className='font-light'>
              Try adjusting the filters or search term.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* If filteredFeedback is not empty */}
      {filteredFeedback.map((feedback) => (
        <div
          className='jusify-between group flex h-14 flex-row items-center border border-b-0 p-1 transition-all hover:bg-accent/30 [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
          key={feedback.id}>
          {/* Upvotes & Title */}
          <div className='flex h-full w-full min-w-0 flex-row items-center'>
            {/* Upvotes */}
            <Button
              variant='secondary'
              size='sm'
              className='flex h-11 flex-col items-center rounded-sm py-1 transition-all duration-150 hover:bg-transparent active:scale-[85%]'
              onClick={() => {
                onUpvoteTag(feedback);
              }}>
              {/* Arrow */}
              <ChevronUp
                className={cn(
                  'text-sm font-light transition-colors group-hover:text-foreground',
                  feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                )}
              />

              {/* Upvotes */}
              <div
                className={cn(
                  'text-sm font-light transition-colors group-hover:text-foreground',
                  feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                )}>
                {feedback.upvotes}
              </div>
            </Button>

            <FeedbackModal
              tags={tags}
              feedbackList={feedbackList}
              setFeedbackList={setFeedbackList}
              key={feedback.id}
              feedback={feedbackList.find((fb) => fb.id === feedback.id) || feedback}
              className='flex h-full w-full cursor-pointer items-center text-start'>
              <span className='line-clamp-1 font-light text-foreground/95'>{feedback.title}</span>
            </FeedbackModal>
          </div>

          {/* Tags & User */}
          <div className='mr-2 flex flex-shrink-0 items-center gap-2'>
            {/* Tags */}
            {feedback.tags &&
              feedback.tags.length > 0 &&
              feedback.tags.map((tag) => (
                <div
                  className='group/tag hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors hover:cursor-pointer hover:border-foreground/20 hover:bg-accent/50 md:flex'
                  key={tag.name.toLowerCase()}
                  onClick={() => {
                    // If already selected, remove the tag
                    if (tag.name.toLowerCase() === searchParams.get('tags')) {
                      router.push(`${pathname}?${createQueryString('tags', '')}`);
                      return;
                    }

                    router.push(`${pathname}?${createQueryString('tags', tag.name)}`);
                  }}>
                  {/* Tag color */}
                  <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }}></div>
                  {/* Tag name */}
                  <div className='text-xs font-light text-foreground/60 transition-colors group-hover/tag:text-foreground/80'>
                    {tag.name}
                  </div>
                </div>
              ))}

            {/* Status Icon */}
            {(() => {
              if (feedback.status) {
                const currentStatus =
                  statusOptions.find(
                    (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                  ) || statusOptions[0];

                return (
                  <div
                    className='group/tag hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border p-1 transition-colors hover:cursor-pointer hover:border-foreground/20 hover:bg-accent/50 md:flex'
                    onClick={() => {
                      // If already selected, remove the status
                      if (currentStatus.label.toLowerCase() === searchParams.get('status')) {
                        router.push(`${pathname}?${createQueryString('status', '')}`);
                        return;
                      }

                      router.push(`${pathname}?${createQueryString('status', currentStatus.label)}`);
                    }}>
                    <currentStatus.icon className='h-4 w-4 text-foreground/60' />
                  </div>
                );
              }
              return null;
            })()}

            {/* Date */}
            <div className='cursor-default select-none text-center text-xs font-extralight text-foreground/50'>
              {formatDate(new Date(feedback.created_at))}
            </div>

            {/* User */}
            <Avatar className='h-6 w-6 gap-2 border'>
              <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user!.full_name} />
              <AvatarFallback>{feedback.user!.full_name}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      ))}
    </div>
  );
}
