import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getPublicWorkspaceFeedback } from '@/lib/api/public';
import { getCurrentUser } from '@/lib/api/user';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import AnalyticsWrapper from '@/components/hub/analytics-wrapper';
import FeedbackHeader from '@/components/hub/feedback/button-header';
import FeedbackList from '@/components/hub/feedback/feedback-list';

type Props = {
  params: { workspace: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: `Feedback - ${workspace.name}`,
    description: 'Have a suggestion or found a bug? Let us know!',
  };
}

export default async function Feedback({ params }: Props) {
  // Get current user
  const { data: user } = await getCurrentUser('server');

  const { data: feedback, error } = await getPublicWorkspaceFeedback(params.workspace, 'server', true, false);

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch workspace config if user not logged in
  // const { data: config } = await getWorkspaceModuleConfig(params.workspace, 'server', true, false);

  return (
    <AnalyticsWrapper className='items-center gap-10 pb-10' workspaceSlug={params.workspace}>
      {/* Header */}
      <div className='flex w-full px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Feedback</h1>
          <p className='text-foreground/70 text-base font-light sm:text-lg'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      {/* content */}
      <div className='flex h-full w-full flex-col items-center justify-center gap-5 px-5 sm:px-10 md:px-10 lg:px-20'>
        <FeedbackHeader isLoggedIn={!!user} workspaceSlug={params.workspace} />

        {/* Main */}
        <div className='flex h-full w-full flex-col justify-between'>
          <FeedbackList feedback={feedback} workspaceSlug={params.workspace} isLoggedIn={!!user} />
        </div>
      </div>
    </AnalyticsWrapper>
  );
}
