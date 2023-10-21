'use client';

import * as React from 'react';
import { cn } from '@ui/lib/utils';
import { format } from 'date-fns';
import { Button } from 'ui/components/ui/button';
import { Calendar } from 'ui/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/ui/popover';
import { ChangelogProps } from '@/lib/types';

export function PublishDatePicker({
  className,
  data,
  setData,
}: {
  className?: string;
  data: ChangelogProps['Row'];
  setData: React.Dispatch<React.SetStateAction<ChangelogProps['Row']>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'bg-root w-[280px] justify-start overflow-hidden text-left font-normal',
            !data.publish_date && 'text-muted-foreground',
            className
          )}>
          {data.publish_date ? (
            <span className='font-extralight'>{format(new Date(data.publish_date), 'P')}</span>
          ) : (
            <span className='text-foreground/50 font-extralight'>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={data.publish_date ? new Date(data.publish_date) : undefined}
          onSelect={(date) => {
            setData({ ...data, publish_date: date?.toISOString() ?? null });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
