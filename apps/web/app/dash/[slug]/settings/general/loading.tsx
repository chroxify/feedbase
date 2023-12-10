import { Skeleton } from 'ui/components/ui/skeleton';

export default function GeneralLoading() {
  return (
    // 3 cards with loading state
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Skeleton className='h-72 w-full' />
      <Skeleton className='h-48 w-full' />
      <Skeleton className='h-48 w-full' />
    </div>
  );
}
