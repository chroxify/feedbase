'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { Label } from '@ui/components/ui/label';
import { Skeleton } from '@ui/components/ui/skeleton';
import { toast } from 'sonner';
import useCreateQueryString from '@/lib/hooks/use-create-query';
import { FeedbackCommentWithUserProps, ProfileProps } from '@/lib/types';
import { Icons } from '@/components/shared/icons/icons-static';
import RichTextEditor from '@/components/shared/tiptap-editor';
import AuthModal from '../../modals/login-signup-modal';
import Comment from './comment';
import { CommentSortCombobox } from './sort-combobox';

export default function CommentsList({
  feedbackComments,
  projectSlug,
  feedbackId,
  user,
}: {
  feedbackComments: FeedbackCommentWithUserProps[] | null;
  projectSlug: string;
  feedbackId: string;
  user: ProfileProps['Row'] | null;
}) {
  const [commentContent, setCommentContent] = useState<string>('');
  const [totalCommentsAndReplies, setTotalCommentsAndReplies] = useState<number | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createQueryString = useCreateQueryString(searchParams);
  const router = useRouter();

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

  // Post comment
  async function onPostComment() {
    // Set loading
    setIsLoading(true);

    // Create promise
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedbackId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
        }),
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
        // Set loading
        setIsLoading(false);

        // Reload comments
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  // Render comments recursively
  const renderComments = useCallback(
    (comments: FeedbackCommentWithUserProps[] | undefined) => {
      return comments?.map((comment: FeedbackCommentWithUserProps) => (
        <Comment commentData={comment} projectSlug={projectSlug} user={user} key={comment.id} id={comment.id}>
          {renderComments(comment.replies)} {/* Recursive call for replies */}
        </Comment>
      ));
    },
    [projectSlug, user]
  );

  // Calculate total comments and replies
  const calculateTotalCommentsAndReplies = useCallback(
    (comments: FeedbackCommentWithUserProps[] | undefined): number => {
      return (comments ?? []).reduce((acc: number, comment: FeedbackCommentWithUserProps) => {
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
        <>
          <div className='prose-invert flex w-full flex-col items-center justify-end rounded-md border p-4'>
            {/* Editable Comment div with placeholder */}
            <RichTextEditor
              content={commentContent}
              setContent={setCommentContent}
              placeholder='Write your comment here...'
            />

            {/* Bottom Row */}
            <div className='flex w-full flex-row items-center justify-end'>
              {/* Submit Button */}
              <Button
                variant='outline'
                className='text-foreground/60 flex h-8 items-center justify-between border font-extralight sm:w-fit'
                size='sm'
                onClick={onPostComment}
                disabled={
                  // disabled if content is 0 or its only html tags
                  commentContent.replace(/<[^>]*>?/gm, '').length === 0 || isLoading
                }>
                {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
                Post Comment
              </Button>
            </div>
          </div>

          <Label className='text-foreground/50 text-xs font-extralight'>
            Pro Tip: You can use Markdown to format your comment.
          </Label>
        </>
      ) : (
        <div className='border-highlight/40 bg-highlight/20 flex w-full flex-col justify-between gap-4 rounded-md border p-3 sm:h-10 sm:flex-row sm:items-center'>
          <p className='text-foreground/90 text-sm font-light'>
            Please authenticate to take part in the discussion.
          </p>

          <div className='flex flex-row items-center gap-2'>
            <AuthModal projectSlug={projectSlug}>
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
            <p className='text-foreground/80 bg-secondary select-none rounded-full px-[9px] py-1 text-xs font-light'>
              {totalCommentsAndReplies}
            </p>
          )}
        </div>

        <CommentSortCombobox
          onSelect={(sort) => {
            router.push(`${pathname}?${createQueryString('sort', sort === 'newest' ? '' : sort)}`);
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
            <p className='text-foreground/60 pb-10 text-sm font-light'>No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
