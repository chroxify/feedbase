'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackBoardProps } from '@/lib/types';
import FetchError from '@/components/shared/fetch-error';
import FeedbackFilterHeader, { FilterFeedback } from '../common/feedback-filters';
import FeedbackItem from './feedback-item';

export default function FeedbackList({
  workspaceSlug,
  feedbackBoards,
}: {
  workspaceSlug: string;
  feedbackBoards: FeedbackBoardProps['Row'][];
}) {
  const { feedback, loading, error, mutate } = useFeedback(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Query params
  const sort = searchParams.get('sort') || '';
  const board = pathname.split('/').pop();

  // Filter feedback by query params if they exist
  const filteredFeedback = FilterFeedback(feedback || []).filter((feedback) => {
    if (!board) return true;

    return (
      feedback.board_id ===
      feedbackBoards.find((b) => b.name.toLowerCase().replace(/\s+/g, '-') === board)?.id
    );
  });

  // Sort feedback by query params if they exist
  filteredFeedback.sort((a, b) => {
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

  return (
    <>
      <FeedbackFilterHeader mutate={mutate} className='py-0 pt-3' />

      {/* Loading state */}
      {loading && !error ? (
        <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
          <h1 className='text-foreground/90 text-2xl '>Loading feedback...</h1>
        </div>
      ) : null}

      {/* Error state */}
      {error ? <FetchError error={error} mutate={mutate} name='feedback' isValidating={loading} /> : null}

      {/* Empty state */}
      {filteredFeedback?.length === 0 && !loading && !error && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
          <h1 className='text-foreground/90 text-2xl '>No feedback yet</h1>
          <p className='text-foreground/60 text-center text-base '>
            This is where you can share your feedback and feature requests.
          </p>
        </div>
      )}

      {/* Feedback list */}
      {filteredFeedback?.length > 0 && !loading && !error && (
        <div className='flex h-full w-full flex-col gap-5 pt-3'>
          {filteredFeedback.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} workspaceSlug={workspaceSlug} />
          ))}
        </div>
      )}
    </>
  );
}
