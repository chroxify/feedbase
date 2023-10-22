import { Separator } from '@ui/components/ui/separator';
import { getPublicProjectFeedback } from '@/lib/api/public';
import { getCurrentUser } from '@/lib/api/user';
import FeedbackHeader from '@/components/hub/feedback/button-header';
import FeedbackList from '@/components/hub/feedback/feedback-list';

export default async function Feedback({ params }: { params: { project: string } }) {
  // Get current user
  const { data: user } = await getCurrentUser('server');

  const { data: feedback, error } = await getPublicProjectFeedback(params.project, 'server', true, false);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col items-center gap-10 pb-10 selection:bg-[#8F9EFF]/20 selection:text-[#8F9EFF]'>
      <div className='flex w-full px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Feedback</h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      {/* content */}
      <div className='flex h-full w-full flex-col items-center justify-center gap-5 px-5 sm:px-10 md:px-10 lg:px-20'>
        <FeedbackHeader isLoggedIn={!!user} projectSlug={params.project} />

        {/* Main */}
        <div className='flex h-full w-full flex-col justify-between'>
          <FeedbackList feedback={feedback} projectSlug={params.project} isLoggedIn={!!user} />
        </div>
      </div>
    </div>
  );
}
