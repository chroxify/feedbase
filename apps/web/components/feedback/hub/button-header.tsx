'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Input } from '@feedbase/ui/components/input';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Clock3, Flame, Plus, PlusIcon, Search, Star, ThumbsUp } from 'lucide-react';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import CreatePostModal from '../../modals/create-post-modal';
import AuthModal from '../../modals/login-signup-modal';
import { FilterCombobox } from '../common/filter-combobox';

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
      <div className='flex w-full flex-col items-start justify-between gap-2 md:h-12 md:flex-row'>
        {/* Sort By Buttons */}
        {/* <div className='flex w-full flex-row items-center justify-start gap-2 md:w-fit'>
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
        </div> */}

        {/* Sort Dropdown */}
        <div className='flex gap-1.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='gap-1.5 pr-2'>
                {currentSort === '' && (
                  <>
                    <Clock3 className='h-3.5 w-3.5' />
                    Recent
                  </>
                )}
                {currentSort === 'trending' && (
                  <>
                    <Flame className='h-3.5 w-3.5' />
                    Trending
                  </>
                )}
                {currentSort === 'upvotes' && (
                  <>
                    <ThumbsUp className='h-3.5 w-3.5' />
                    Upvotes
                  </>
                )}
                <ChevronUpDownIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem
                className='gap-1.5'
                key='upvotes'
                onSelect={() => {
                  setCurrentSort('upvotes');
                  createQueryString('sort', 'upvotes');
                }}>
                <ThumbsUp className='h-4 w-4' />
                <span>Upvotes</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-1.5'
                key='recent'
                onSelect={() => {
                  setCurrentSort('');
                  createQueryString('sort', '');
                }}>
                <Clock3 className='h-4 w-4' />
                <span>Recent</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-1.5'
                key='trending'
                onSelect={() => {
                  setCurrentSort('trending');
                  createQueryString('sort', 'trending');
                }}>
                <Flame className='h-4 w-4' />
                <span>Trending</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <FilterCombobox size='icon' />
        </div>

        <div className='flex w-full flex-row items-center justify-start gap-1.5 md:w-fit'>
          {/* Search */}
          <div className='relative flex w-full items-center justify-end md:w-72'>
            {/* Input */}
            <Input
              placeholder='Search posts'
              className='px-8'
              onChange={(e) => {
                createQueryString('search', e.target.value);
              }}
            />

            {/* Icon */}
            <Search className='text-muted-foreground absolute left-3 h-4 w-4' />
          </div>

          {isLoggedIn ? (
            <CreatePostModal workspaceSlug={workspaceSlug}>
              <Button variant='default' className='font-base shrink-0 text-sm'>
                Create Post
              </Button>
            </CreatePostModal>
          ) : (
            <AuthModal>
              <Button variant='default'>
                Create Post
                <PlusIcon className='ml-1 h-4 w-4' />
              </Button>
            </AuthModal>
          )}
        </div>
      </div>
    </>
  );
}
