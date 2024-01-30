import React from 'react';
import { getProjectAnalytics } from '@/lib/api/projects';
import AnalyticsCards from '@/components/dashboard/analytics/chart-cards';

export default async function AnalyticsPage({ params }: { params: { slug: string } }) {
  const { data, error } = await getProjectAnalytics(params.slug, 'server');

  if (!data) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col gap-10 overflow-y-auto pt-3 md:pt-10'>
      <AnalyticsCards
        analyticsData={data.timeseries}
        topFeedbackData={data.topFeedback}
        topChangelogData={data.topChangelogs}
      />
    </div>
  );
}
