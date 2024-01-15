import { Separator } from '@ui/components/ui/separator';
import { Skeleton } from '@ui/components/ui/skeleton';
import FeedbackHeader from '@/components/hub/feedback/button-header';

export default function FeedbackLoading() {
  return (
    <div className='flex h-full w-full flex-col items-center gap-10 pb-10'>
      <div className='flex w-full px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Feedback</h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Separator */}
      <Separator className='bg-border/60' />

      {/* Content */}
      <div className='flex h-full w-full flex-col items-center justify-center gap-5 px-5 sm:px-10 md:px-10 lg:px-20'>
        <FeedbackHeader isLoggedIn={false} projectSlug='' projectConfig={null} />{' '}
        {/* Provide placeholder values */}
        {/* Main */}
        <div className='flex h-full w-full flex-col justify-between'>
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className='mb-4 flex h-36 items-center gap-4 rounded-md p-4 shadow-md' />
          ))}
        </div>
      </div>
    </div>
  );
}
