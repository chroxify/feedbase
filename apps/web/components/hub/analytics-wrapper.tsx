'use client';

import { useEffect } from 'react';
import { cn } from '@ui/lib/utils';

export default function AnalyticsWrapper({
  children,
  projectSlug,
  feedbackId,
  changelogId,
  className,
}: {
  children: React.ReactNode;
  projectSlug: string;
  feedbackId?: string;
  changelogId?: string;
  className?: string;
}) {
  // Register View
  useEffect(() => {
    fetch(`/api/v1/${projectSlug}/views`, {
      method: 'POST',
      body: JSON.stringify({
        feedbackId,
        changelogId,
      }),
    });
  }, [projectSlug, feedbackId, changelogId]);

  return <div className={cn('flex h-full w-full flex-col', className)}>{children}</div>;
}
