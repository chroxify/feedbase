'use client';

import { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Separator } from '@feedbase/ui/components/separator';
import { cn } from '@feedbase/ui/lib/utils';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import FeedbackKanban from './kanban';

export default function RoadmapBoard() {
  const [tab, setTab] = useState<'status' | 'quarterly' | 'monthly'>('status');
  const { feedback } = useFeedback();

  // Sort the feedback into groups based on status { 'STATUS': [feedback], ... }
  const feedbackGroups = feedback?.reduce(
    (acc, curr) => {
      const status = curr.status;
      if (status) {
        if (acc[status]) {
          acc[status].push(curr);
        } else {
          acc[status] = [curr];
        }
      }
      return acc;
    },
    {} as Record<string, FeedbackWithUserProps[]>
  );

  return (
    <>
      {/* Header tabs */}
      <div className='z-10 -mb-[1px] flex w-full flex-row items-center justify-start gap-2.5 px-5 pt-3'>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'status' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('status');
          }}>
          <CircleDashed className='h-4 w-4' />
          Status
        </Button>

        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'quarterly' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('quarterly');
          }}>
          <CalendarRange className='h-4 w-4' />
          Quarterly
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit shrink-0 gap-1.5 rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'monthly' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('monthly');
          }}>
          <CircleDotDashed className='h-4 w-4' />
          Monthly
        </Button>
      </div>

      <Separator />

      {/* Kanban Board */}
      {feedbackGroups ? <FeedbackKanban data={feedbackGroups} columns={STATUS_OPTIONS} /> : null}
    </>
  );
}
