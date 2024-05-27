'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { cn } from '@feedbase/ui/lib/utils';
import { Clock3, Flame, Search, Star } from 'lucide-react';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import CreatePostModal from '../../modals/create-post-modal';
import AuthModal from '../../modals/login-signup-modal';

export default function FeedbackHeader({
  isLoggedIn,
  workspaceSlug,
}: {
  isLoggedIn: boolean;
  workspaceSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(router, pathname, searchParams);

  // Query params
  const sort = searchParams.get('sort') || '';

  const [currentSort, setCurrentSort] = useState<string>(sort);

  return (
    <>
      {/* Header */}
      <div className='flex w-full flex-col items-center justify-between gap-2 md:h-12 md:flex-row'>
        {/* Sort By Buttons */}
        <div className='flex w-full flex-row items-center justify-start gap-2 md:w-fit'>
          {/* Newest */}
          <Button
            variant='outline'
            className={cn(
              'text-foreground/70 hover:text-foreground/80 border text-sm  transition-all duration-200',
              currentSort === '' && 'bg-secondary ring-ring/80 text-foreground/80 ring-1'
            )}
            onClick={() => {
              setCurrentSort('');
              createQueryString('sort', '');
            }}
            size='sm'>
            <Clock3 className='mr-1.5 h-4 w-4' />
            New
          </Button>

          {/* Trending */}
          <Button
            variant='outline'
            className={cn(
              'text-foreground/70 hover:text-foreground/80 border text-sm  transition-all duration-200',
              currentSort === 'trending' && 'bg-secondary ring-ring/80 text-foreground/80 ring-1'
            )}
            onClick={() => {
              setCurrentSort('trending');
              createQueryString('sort', 'trending');
            }}
            size='sm'>
            <Flame className='mr-1 h-4 w-4' />
            Trending
          </Button>

          {/* Most Upvotes */}
          <Button
            variant='outline'
            className={cn(
              'text-foreground/70 hover:text-foreground/80 border text-sm  transition-all duration-200',
              currentSort === 'upvotes' && 'bg-secondary ring-ring/80 text-foreground/80 ring-1'
            )}
            onClick={() => {
              setCurrentSort('upvotes');
              createQueryString('sort', 'upvotes');
            }}
            size='sm'>
            <Star className='mr-1 h-4 w-4' />
            Top
          </Button>
        </div>

        <div className='flex w-full flex-row items-center justify-start gap-2 md:w-fit'>
          {/* Search */}
          <div className='relative flex w-full items-center justify-end md:w-72'>
            {/* Input */}
            <Input
              placeholder='Search posts'
              className='text-foreground/70 placeholder: h-9 w-full rounded-md border bg-transparent  px-8'
              onChange={(e) => {
                createQueryString('search', e.target.value);
              }}
            />

            {/* Icon */}
            <Search className='text-foreground/50 absolute left-3 h-4 w-4' />
          </div>

          {isLoggedIn ? (
            <CreatePostModal workspaceSlug={workspaceSlug}>
              <Button variant='default' className='font-base shrink-0 text-sm'>
                Create Post
              </Button>
            </CreatePostModal>
          ) : (
            <AuthModal workspaceSlug={workspaceSlug}>
              <Button variant='default' className='font-base shrink-0 text-sm'>
                Create Post
              </Button>
            </AuthModal>
          )}
        </div>
      </div>
    </>
  );
}