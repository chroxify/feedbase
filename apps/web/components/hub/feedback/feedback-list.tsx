'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { cn } from '@ui/lib/utils';
import { ChevronUp, MessagesSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { PROSE_CN } from '@/lib/constants';
import { FeedbackWithUserProps, ProjectConfigWithoutSecretProps } from '@/lib/types';
import AuthModal from '../modals/login-signup-modal';

interface FeedbackWithTimeAgo extends FeedbackWithUserProps {
  timeAgo: string;
}

export default function FeedbackList({
  feedback,
  projectSlug,
  projectConfig,
  isLoggedIn,
}: {
  feedback: FeedbackWithUserProps[];
  projectSlug: string;
  projectConfig: ProjectConfigWithoutSecretProps | null;
  isLoggedIn: boolean;
}) {
  // Update the feedback list with the timeAgo field
  const updateFeedbackListWithTimeAgo = useCallback((feedbackList: FeedbackWithUserProps[]) => {
    return feedbackList.map((feedbackItem) => {
      const createdDate = new Date(feedbackItem.created_at);
      const timeAgo = formatTimeAgo(createdDate);
      return { ...feedbackItem, timeAgo };
    });
  }, []);

  const [feedbackList, setFeedbackList] = useState<FeedbackWithTimeAgo[]>(
    updateFeedbackListWithTimeAgo(feedback)
  );
  const searchParams = useSearchParams();

  // Query params
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  // Filter feedback by query params if they exist
  const filteredFeedback = feedbackList.filter((feedback) => {
    // Filter by search
    if (search && !feedback.title.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  // Sort feedback by query params if they exist
  const sortedFeedback = filteredFeedback.sort((a, b) => {
    let upvoteScoreA, upvoteScoreB, commentScoreA, commentScoreB, trendingScoreA, trendingScoreB;

    // Switch case for sort
    switch (sort) {
      case 'trending':
        // Calculate upvote trend score
        upvoteScoreA =
          a.upvotes / ((new Date().getTime() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24));
        upvoteScoreB =
          b.upvotes / ((new Date().getTime() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24));

        // Calculate comment trend score
        commentScoreA =
          a.comment_count /
          ((new Date().getTime() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24));
        commentScoreB =
          b.comment_count /
          ((new Date().getTime() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24));

        // Calculate trending score
        trendingScoreA = upvoteScoreA + commentScoreA;
        trendingScoreB = upvoteScoreB + commentScoreB;

        return trendingScoreB - trendingScoreA;
      case 'upvotes':
        return b.upvotes - a.upvotes;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Time ago
  function formatTimeAgo(date: Date) {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();

    const times = [
      { unit: 'year', value: 1000 * 60 * 60 * 24 * 365 },
      { unit: 'month', value: 1000 * 60 * 60 * 24 * 30 },
      { unit: 'day', value: 1000 * 60 * 60 * 24 },
      { unit: 'hour', value: 1000 * 60 * 60 },
      { unit: 'minute', value: 1000 * 60 },
      { unit: 'second', value: 1000 },
    ];

    for (const unit of times) {
      const value = Math.floor(timeDiff / unit.value);
      if (value >= 1) {
        return `${value} ${unit.unit}${value > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  // Upvote feedback
  function onUpvote(feedback: FeedbackWithUserProps) {
    // Find index of feedback
    const index = feedbackList.findIndex((fb) => fb.id === feedback.id);

    // Create new feedback list
    const newFeedbackList = [...feedbackList];

    // Update feedback has_upvoted
    const hasUpvoted =
      projectConfig?.feedback_allow_anon_upvoting && !isLoggedIn
        ? !JSON.parse(window?.localStorage?.getItem('upvotes') || '{}')[feedback.id]
        : !feedback.has_upvoted;

    newFeedbackList[index] = {
      ...newFeedbackList[index],
      has_upvoted: hasUpvoted,
      upvotes: feedback.upvotes + (hasUpvoted ? 1 : -1),
    };

    // Update feedback.has_upvoted for immediate UI feedback
    feedback.has_upvoted = hasUpvoted;

    // Set feedbackList
    setFeedbackList(newFeedbackList);

    // If anon upvoting is allowed, store new upvote state in local storage
    if (projectConfig?.feedback_allow_anon_upvoting && !isLoggedIn) {
      const upvotes = JSON.parse(window?.localStorage?.getItem('upvotes') || '{}');
      upvotes[feedback.id] = hasUpvoted;
      window?.localStorage?.setItem('upvotes', JSON.stringify(upvotes));
    }

    const promise = new Promise((resolve, reject) => {
      fetch(
        `/api/v1/projects/${projectSlug}/feedback/${feedback.id}/upvotes${
          projectConfig?.feedback_allow_anon_upvoting && !isLoggedIn
            ? `?has_upvoted=${!feedback.has_upvoted}`
            : ''
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
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

    promise.catch((err) => {
      toast.error(err);

      // Update upvotes
      newFeedbackList[index].upvotes = feedback.upvotes + (feedback.has_upvoted ? -1 : 1);

      // Update feedback
      newFeedbackList[index].has_upvoted = !feedback.has_upvoted;

      // Set feedbackList
      setFeedbackList(newFeedbackList);

      // If anon upvoting is allowed, store upvote state in localstorage
      if (projectConfig?.feedback_allow_anon_upvoting) {
        const upvotes = JSON.parse(window?.localStorage?.getItem('upvotes') || '{}');
        upvotes[feedback.id] = newFeedbackList[index].has_upvoted;
        window?.localStorage?.setItem('upvotes', JSON.stringify(upvotes));
      }
    });
  }

  useEffect(() => {
    setFeedbackList(updateFeedbackListWithTimeAgo(feedback));
  }, [feedback, updateFeedbackListWithTimeAgo]);

  // Helper function to compare feedback lists
  // Needed for localstorage upvote state on mount
  function areFeedbackListsEqual(list1: FeedbackWithUserProps[], list2: FeedbackWithUserProps[]) {
    if (list1.length !== list2.length) {
      return false;
    }

    for (let i = 0; i < list1.length; i++) {
      if (list1[i].id !== list2[i].id || list1[i].has_upvoted !== list2[i].has_upvoted) {
        return false;
      }
    }

    return true;
  }

  // Set upvotes from localstorage
  useEffect(() => {
    if (projectConfig?.feedback_allow_anon_upvoting && !isLoggedIn) {
      const upvotes = JSON.parse(window?.localStorage?.getItem('upvotes') || '{}');
      const newFeedbackList = [...feedbackList];

      for (const feedback of newFeedbackList) {
        feedback.has_upvoted = upvotes[feedback.id] || false;
      }

      // Update feedbackList only if it has changed
      setFeedbackList((prevFeedbackList) => {
        // Update feedbackList only if it has changed
        if (!areFeedbackListsEqual(newFeedbackList, prevFeedbackList)) {
          return newFeedbackList;
        }
        return prevFeedbackList; // No change, return the previous state
      });
    }
  }, [feedbackList, isLoggedIn, projectConfig]);

  return (
    <>
      {sortedFeedback?.map((feedback) => (
        <div
          className='hover:bg-accent/30 group flex h-full w-full cursor-pointer flex-row items-stretch justify-between border border-b-0 transition-all first:rounded-t-md last:rounded-b-md last:border-b'
          key={feedback.id}>
          {/* Upvotes */}
          <AuthModal
            projectSlug={projectSlug}
            disabled={isLoggedIn || projectConfig?.feedback_allow_anon_upvoting ? true : undefined}>
            <div className='flex items-center border-r'>
              {/* Upvotes */}
              <Button
                variant='secondary'
                size='sm'
                className='group/upvote flex h-full flex-col items-center rounded-sm px-4 transition-all duration-150 hover:bg-transparent active:scale-[85%]'
                onClick={() => {
                  if (!isLoggedIn && !projectConfig?.feedback_allow_anon_upvoting) return;

                  onUpvote(feedback);
                }}>
                {/* Arrow */}
                <ChevronUp
                  className={cn(
                    'h-4 text-sm font-light transition-colors ',
                    feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                  )}
                />

                {/* Upvotes */}
                <div
                  className={cn(
                    'text-sm font-light transition-colors',
                    feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                  )}>
                  {feedback.upvotes}
                </div>
              </Button>
            </div>
          </AuthModal>

          {/* Main Content */}
          <Link
            href={`/feedback/${feedback.id}`}
            className='flex flex-grow flex-col items-start justify-between gap-3 p-4'>
            <div className='flex flex-col gap-1'>
              {/* Title */}
              <span className='text-foreground/90 line-clamp-2 pr-10 text-sm font-medium'>
                {feedback.title}
              </span>

              {/* Description */}
              <div
                className={cn('line-clamp-2 max-w-full text-sm', PROSE_CN)}
                dangerouslySetInnerHTML={{ __html: feedback.description }}
              />
            </div>

            {/* Author */}
            <div className='text-foreground/60 flex select-none flex-row items-center justify-start gap-2 font-light'>
              {/* User */}
              <Avatar className='h-6 w-6 gap-2 border'>
                <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
                <AvatarFallback className='text-xs font-light'>{feedback.user.full_name[0]}</AvatarFallback>
              </Avatar>
              {/* Name */}
              <span className='text-foreground/70 text-sm font-extralight'>{feedback.user.full_name}</span>·
              {/* Time ago */}
              <span className='text-foreground/50 text-xs font-extralight'>{feedback.timeAgo}</span>
            </div>
            {/* </div> */}
          </Link>

          {/* Comments Count */}
          <div className='text-foreground/50 hidden flex-row items-center justify-center gap-1.5 pl-2 pr-5 sm:flex'>
            <MessagesSquare className='text-foreground/50 h-4 w-4' />
            <span className='text-foreground/50 text-sm font-extralight'>{feedback.comment_count}</span>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {sortedFeedback?.length === 0 && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
          <h1 className='text-foreground/90 text-2xl font-light'>No feedback yet</h1>
          <p className='text-foreground/60 text-center text-base font-light'>
            This is where you can share your feedback and feature requests.
          </p>
        </div>
      )}
    </>
  );
}
