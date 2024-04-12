'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher } from '@/lib/utils';
import AnimatedTabs from '@/components/layout/animated-tabs';
import FeedbackKanban from './kanban';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function RoadmapBoard() {
  const [tab, setTab] = useState('Status');
  const { feedback } = useFeedback();
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
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

  Object.values(kanbanData).forEach((feedbackList) => {
    switch ((searchParams.get('sort') as sortingOptions) || 'upvotes') {
      case 'upvotes':
        feedbackList.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'created':
        feedbackList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'trending':
        // Most upvotes & comments in the last 7 days
        feedbackList.sort((a, b) => {
          const aScore = a.upvotes + a.comment_count;
          const bScore = b.upvotes + b.comment_count;
          return bScore - aScore;
        });
    }
  });

  // Keep the kanban data in sync with the feedback data
  useEffect(() => {
    setKanbanData(groupFeedbackByStatus());
  }, [feedback, groupFeedbackByStatus]);

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
      <AnimatedTabs
        tabs={[
          {
            label: 'Status',
            icon: CircleDashed,
          },
          {
            label: 'Quarterly',
            icon: CalendarRange,
          },
          {
            label: 'Monthly',
            icon: CircleDotDashed,
          },
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

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
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
        />
      ) : null}
    </>
  );
}
