'use client';

import { useState } from 'react';
import { Button } from '@ui/components/ui/button';
import { Separator } from '@ui/components/ui/separator';
import { cn } from '@ui/lib/utils';
import { Filter, Plus, X } from 'lucide-react';
import { Input } from 'ui/components/ui/input';
import { SearchIcon } from '@/components/shared/icons/icons-animated';
import LottiePlayer from '@/components/shared/lottie-player';

export default function FeedbackHeader() {
  const [searchActive, setSearchActive] = useState(false);
  const [animate, setAnimate] = useState(false);

  return (
    <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
      <h2 className='text-2xl font-medium'>Feedback</h2>

      <div className='flex items-center gap-3'>
        {/* Search */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className={cn(
              'text-secondary-foreground hover:text-foreground relative flex w-8 items-center gap-1 overflow-hidden transition-all',
              searchActive && 'w-60'
            )}>
            <Input
              placeholder='Search feedback'
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'absolute left-0 w-52 rounded-none border-transparent pr-0.5',
                !searchActive && 'w-0 cursor-pointer !opacity-0'
              )}
            />
            <button
              className='bg-background absolute right-0 z-10 flex h-8 w-8 items-center justify-center'
              onClick={() => setSearchActive(!searchActive)}
              onMouseEnter={() => setAnimate(true)}
              onMouseLeave={() => setAnimate(false)}>
              {/* Icon */}
              <LottiePlayer
                lottieSrc={SearchIcon}
                animate={animate}
                initialColor='hsl(var(--secondary-foreground))'
                animationColor='hsl(var(--foreground))'
                className={cn('h-4 w-4', searchActive && 'hidden')}
              />
              <X className={cn('h-4 w-4', !searchActive && 'hidden')} />
            </button>
          </Button>

          <Button
            variant={'outline'}
            className='text-secondary-foreground hover:text-foreground flex items-center gap-1'>
            <Filter className='h-4 w-4' />
            Filter
          </Button>
        </div>

        {/* Seperator Line */}
        <Separator orientation='vertical' className='h-6' />

        {/* Create new Button */}
        <Button variant='default' className='flex items-center gap-1'>
          <Plus className='-ml-[2px] inline-flex h-[18px] w-[18px]' />
          Create Post
        </Button>
      </div>
    </div>
  );
}
