'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Separator } from '@feedbase/ui/components/separator';
import { cn } from '@feedbase/ui/lib/utils';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher } from '@/lib/utils';
import FeedbackKanban from './kanban';

export default function RoadmapBoard() {
  const [tab, setTab] = useState<'status' | 'quarterly' | 'monthly'>('status');
  const { feedback } = useFeedback();
  const { slug } = useParams<{ slug: string }>();
  const [kanbanData, setKanbanData] = useState(groupFeedbackByStatus());

  // Sort the feedback into groups based on status { 'STATUS': [feedback], ... }
  function groupFeedbackByStatus(): Record<string, FeedbackWithUserProps[]> {
    return (
      feedback?.reduce(
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
      ) || {}
    );
  }

  // Keep the kanban data in sync with the feedback data
  useEffect(() => {
    setKanbanData(groupFeedbackByStatus());
  }, [feedback]);

  const { trigger: updateFeedback } = useSWRMutation(
    `/api/v1/projects/${slug}/feedback`, // using general feedback endpoint here so that it mutates the feedback cache - proper url is set in the inputOverride
    actionFetcher,
    {
      onError: () => {
        toast.error('Failed to update feedback');
        setKanbanData(groupFeedbackByStatus());
      },
    }
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
      {kanbanData ? (
        <FeedbackKanban
          data={kanbanData}
          columns={STATUS_OPTIONS}
          onDataChange={(data) => {
            // Compare new data with old data to get the changed feedback
            const changedFeedback = feedback?.filter((feedback) => {
              const newFeedback = data[feedback.status];
              return !newFeedback || !newFeedback.find((f) => f.id === feedback.id);
            });

            // Get the category the feedback was moved to
            const newStatus = Object.keys(data).find((status) =>
              data[status].find((f) => f.id === changedFeedback?.[0]?.id)
            );

            // Update feedback
            changedFeedback?.forEach((feedback) => {
              updateFeedback({
                status: newStatus,
                method: 'PATCH',
                inputOverride: `/api/v1/projects/${slug}/feedback/${feedback.id}`,
              });
            });

            // Update local feedback - set state here even if we have a effect listener to make it smoother
            setKanbanData(data);
          }}
        />
      ) : null}
    </>
  );
}
