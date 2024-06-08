'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import { CommentWithUserProps, ProfileProps } from '@/lib/types';
import AuthModal from '../../modals/login-signup-modal';
import CommentInput from '../comments/comment-input';
import Comment from './comment';
import { CommentSortCombobox } from './sort-combobox';

export default function CommentsList({
  feedbackComments,
  workspaceSlug,
  feedbackId,
  user,
}: {
  feedbackComments: CommentWithUserProps[] | null;
  workspaceSlug: string;
  feedbackId: string;
  user: ProfileProps['Row'] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [totalCommentsAndReplies, setTotalCommentsAndReplies] = useState<number | null>(null);
  const createQueryString = useCreateQueryString(router, pathname, searchParams);

  // Query params
  const sort = searchParams.get('sort') || '';
  const comment = searchParams.get('comment') || '';

  // Sort comments by query params if they exist
  const sortedComments = feedbackComments?.sort((a, b) => {
    // Switch case for sort
    switch (sort) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'best':
        return b.upvotes - a.upvotes;
      case 'worst':
        return a.upvotes - b.upvotes;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Render comments recursively
  const renderComments = useCallback(
    (comments: CommentWithUserProps[] | undefined) => {
      return comments?.map((comment: CommentWithUserProps) => (
        <Comment
          commentData={comment}
          workspaceSlug={workspaceSlug}
          user={user}
          key={comment.id}
          id={comment.id}>
          {renderComments(comment.replies)} {/* Recursive call for replies */}
        </Comment>
      ));
    },
    [workspaceSlug, user]
  );

  // Calculate total comments and replies
  const calculateTotalCommentsAndReplies = useCallback(
    (comments: CommentWithUserProps[] | undefined): number => {
      return (comments ?? []).reduce((acc: number, comment: CommentWithUserProps) => {
        const commentCount = 1 + (comment.replies ? calculateTotalCommentsAndReplies(comment.replies) : 0);
        return acc + commentCount;
      }, 0);
    },
    []
  );

  // Scroll to comment if query param is present
  useEffect(() => {
    // If comment query param is present, scroll to comment
    if (comment) {
      const commentElement = document.getElementById(comment);

      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [comment]);

  useEffect(() => {
    setTotalCommentsAndReplies(calculateTotalCommentsAndReplies(sortedComments));
  }, [sortedComments, calculateTotalCommentsAndReplies]);

  return (
    <div className='flex h-full w-full flex-col gap-2 pb-5'>
      {/* Write Comment Text Area */}
      {user ? (
        <CommentInput workspaceSlug={workspaceSlug} feedbackId={feedbackId} />
      ) : (
        <div className='border-highlight/40 bg-highlight/20 flex w-full flex-col justify-between gap-4 rounded-md border p-3 sm:h-10 sm:flex-row sm:items-center'>
          <p className='text-foreground/90 text-sm '>Please authenticate to take part in the discussion.</p>

          <div className='flex flex-row items-center gap-2'>
            <AuthModal>
              <p className='text-foreground/90 font- hover:text-foreground cursor-pointer text-xs transition-colors'>
                Login / Sign up →
              </p>
            </AuthModal>
          </div>
        </div>
      )}

      {/* Comments Header */}
      <div className='flex h-full w-full flex-row justify-between pt-5'>
        <div className='flex flex-row items-center gap-1.5'>
          <p className='text-foreground/100 text-sm font-medium'>Comments</p>
          {totalCommentsAndReplies === null ? (
            <Skeleton className='h-6 w-7 rounded-full' />
          ) : (
            <p className='text-foreground/80 bg-secondary select-none rounded-full px-[9px] py-1 text-xs '>
              {totalCommentsAndReplies}
            </p>
          )}
        </div>

        <CommentSortCombobox
          onSelect={(sort) => {
            createQueryString('sort', sort === 'newest' ? '' : sort);
          }}
          initialValue={sort === '' ? 'newest' : sort}
        />
      </div>

      {/* Comments */}
      <div className='flex h-full w-full flex-col gap-5'>
        {/* BUG: This currently forces re-render on each render, a possible way is to also include it in the useCallback but then change logic for scrolling down as it takes a bit until mounted */}
        {renderComments(sortedComments)}

        {/* Empty State */}
        {feedbackComments?.length === 0 && (
          <div className='flex h-full w-full flex-col items-center justify-center pt-10'>
            <p className='text-foreground/60 pb-10 text-sm '>No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
