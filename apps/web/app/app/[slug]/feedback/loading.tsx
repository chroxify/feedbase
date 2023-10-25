import { Skeleton } from '@ui/components/ui/skeleton';

export default function FeedbackLoading() {
  return (
    <>
      <Skeleton className='mt-5 h-10 w-full' />
      <Skeleton className='mt-3 h-80 w-full' />
    </>
  );
}
