import { Separator } from '@ui/components/ui/separator';
import { Skeleton } from '@ui/components/ui/skeleton';

export default function ChangelogLoading() {
  return (
    <div className='flex h-full w-full flex-col gap-10 selection:bg-[#8F9EFF]/20 selection:text-[#8F9EFF]'>
      <div className='flex items-center px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>
            <Skeleton className='h-8 w-[200px]' />
          </h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            <Skeleton className='h-5 w-[400px]' />
          </p>
          <div className='flex select-none flex-row items-center gap-4 text-sm'>
            <Skeleton className='h-5 w-[200px]' />
            <Skeleton className='h-5 w-[200px]' />
          </div>
        </div>
      </div>
      <Separator className='bg-border/60' />

      <div className='flex flex-col'>
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'>
            <div className='relative flex'>
              <div className='flex w-full pb-4 pr-5 md:w-[200px] md:pb-0'>
                <Skeleton className='h-5 w-full' />
              </div>
              <div className='relative hidden w-full md:flex md:w-[150px]'>
                <div className='bg-foreground/70 sticky left-0 top-[46px] mt-1.5 h-1.5 w-1.5 rounded-full' />
                <div className='bg-foreground/20 absolute left-0.5 top-1 h-full w-[1.5px]' />
              </div>
            </div>
            <div className='flex w-full flex-col pb-16'>
              <Skeleton className='h-36 w-full' />

              <div className='pb-4 pt-8'>
                <Skeleton className='h-8 w-[300px]' />
              </div>
              <Skeleton className='h-5 w-full' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
