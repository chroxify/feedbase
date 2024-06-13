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
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Clock3, Flame, PlusIcon, Search, ThumbsUp } from 'lucide-react';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import { ProfileProps, WorkspaceModuleProps } from '@/lib/types';
import CreatePostModal from '../../modals/create-post-modal';
import AuthModal from '../../modals/login-signup-modal';
import { FilterCombobox } from '../common/filter-combobox';

export default function FeedbackHeader({
  user,
  moduleConfig,
}: {
  user: ProfileProps['Row'] | null;
  moduleConfig: WorkspaceModuleProps['Row'];
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
      <div className='flex w-full flex-col items-start justify-between gap-2 md:flex-row'>
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

          {(user && !user.is_anonymous) || moduleConfig?.feedback_anon_posting ? (
            <CreatePostModal>
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
