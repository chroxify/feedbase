import { Skeleton } from 'ui/components/ui/skeleton';

export default function TeamLoading() {
  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Skeleton className='h-56 w-full' />
    </div>
  );
}
