'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
            'w-[280px] justify-start text-left font-normal',
            !data.publish_date && 'text-muted-foreground',
            className
          )}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {data.publish_date ? format(new Date(data.publish_date), 'P') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={new Date(data?.publish_date!) ?? undefined}
          onSelect={(date) => {
            setData({ ...data, publish_date: date?.toISOString() ?? null });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
