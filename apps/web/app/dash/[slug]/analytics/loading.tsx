import { Skeleton } from '@ui/components/ui/skeleton';

export default function FeedbackLoading() {
  return (
    <div className='flex w-full flex-col gap-10 pt-3 md:pt-10'>
      <div className='flex w-full flex-col gap-10 lg:flex-row'>
        <Skeleton className='h-72 w-full' />
        <Skeleton className='h-72 w-full' />
      </div>

      <div className='flex w-full flex-col gap-10 sm:flex-row'>
        <Skeleton className='h-80 w-full' />
        <Skeleton className='h-80 w-full' />
      </div>
    </div>
  );
}
