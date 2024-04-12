'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { CalendarClock, Flame, ThumbsUp } from 'lucide-react';
import useQueryParamRouter from '@/lib/hooks/use-query-router';

export default function SortFeedbackDropdown() {
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  function renderActiveSort() {
    switch (searchParams.get('sort') || 'upvotes') {
      case 'upvotes':
        return (
          <div className='flex items-center gap-1.5'>
            <ThumbsUp className='h-3.5 w-3.5' />
            Upvotes
          </div>
        );
      case 'recent':
        return (
          <div className='flex items-center gap-1.5'>
            <CalendarClock className='h-3.5 w-3.5' />
            Recent
          </div>
        );
      case 'trending':
        return (
          <div className='flex items-center gap-1.5'>
            <Flame className='h-3.5 w-3.5' />
            Trending
          </div>
        );
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='text-secondary-foreground hover:text-foreground flex items-center gap-2'>
          {renderActiveSort()}

          <ChevronUpDownIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-36' align='end'>
        <DropdownMenuItem
          className='flex items-center gap-1.5'
          onSelect={() => { createQueryParams('sort', 'upvotes'); }}>
          <ThumbsUp className='h-4 w-4' />
          Upvotes
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-1.5'
          onSelect={() => { createQueryParams('sort', 'recent'); }}>
          <CalendarClock className='h-4 w-4' />
          Recent
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-1.5'
          onSelect={() => { createQueryParams('sort', 'trending'); }}>
          <Flame className='h-4 w-4' />
          Trending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
