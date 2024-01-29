import { Separator } from '@ui/components/ui/separator';
import { Skeleton } from '@ui/components/ui/skeleton';

export default function FeedbackPageLoading() {
  return (
    <div className='relative flex w-full flex-row px-5 sm:px-10 md:px-8 lg:px-10'>
      <div className='flex h-full w-full flex-col md:w-5/6 md:border-r md:pr-5 lg:flex-row'>
        <div className='relative flex pr-5'>
          <div className='flex w-full max-w-[150px] pb-4 lg:pb-0'>
            <Skeleton className='h-5 w-[150px]' />
          </div>
        </div>
        <div className='flex h-screen w-full flex-col gap-5'>
          <div className='flex w-full flex-col gap-4'>
            <h1 className='text-foreground/100 max-w-96 w-full text-2xl font-bold'>
              <Skeleton className='h-8 w-full' />
            </h1>

            <div className='flex w-full flex-col gap-2'>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Skeleton className='h-5 w-full' key={index} />
              ))}
            </div>

            {/* Info Mobile */}
            <div className='flex h-full w-full flex-col md:hidden'>
              <div className='flex h-full w-full flex-col gap-5 border-t p-5'>
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm font-light'>Upvotes</p>
                  <Skeleton className='h-5 w-10' />
                </div>

                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm font-light'>Status</p>
                  <Skeleton className='h-5 w-[80px]' />
                </div>

                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm font-light'>Tags</p>
                  <div className='flex w-[100px] gap-2'>
                    <Skeleton className='h-5 w-20' />
                    <Skeleton className='h-5 w-20' />
                  </div>
                </div>
              </div>

              <Separator className='w-full' />

              <div className='flex h-full w-full flex-col gap-5 px-5 pt-5'>
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm font-light'>Created</p>
                  <Skeleton className='h-5 w-24' />
                </div>

                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm font-light'>Author</p>
                  <div className='flex flex-row items-center gap-2 font-light'>
                    <Skeleton className='h-7 w-7 rounded-full' />
                    <Skeleton className='h-5 w-32' />
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <div className='flex w-full flex-row items-center justify-between'>
              <Skeleton className='h-20 w-full' />
            </div>

            {/* Comments */}
            <div className='flex h-fit w-full flex-row justify-between'>
              <div className='flex flex-row items-center gap-1.5'>
                <p className='text-foreground/100 text-sm font-medium'>Comments</p>
                <Skeleton className='h-6 w-6 rounded-full' />
              </div>

              <Skeleton className='h-7 w-20' />
            </div>

            <div className='flex h-full w-full flex-col gap-5'>
              {[1, 2, 3].map((index) => (
                <div className='flex h-full w-full flex-col' key={index}>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center'>
                      <div className='text-foreground/60 flex select-none flex-row items-center justify-start gap-2 font-light'>
                        <Skeleton className='h-8 w-8 gap-2 rounded-full' />
                        <Skeleton className='h-5 w-20 rounded-sm' />
                        ·
                        <Skeleton className='h-5 w-20 rounded-sm' />
                      </div>
                    </div>
                  </div>

                  <div className='flex h-full min-h-fit w-full flex-row gap-5'>
                    <div className='relative flex flex-col items-center justify-center'>
                      <Separator
                        className='from-border to-root/95 absolute left-[14px] top-1 h-full w-1 rounded-lg bg-gradient-to-b'
                        orientation='vertical'
                      />
                    </div>

                    <div className='flex h-full w-full flex-col gap-1 pl-5'>
                      <Skeleton className='h-20' />

                      <div className='flex w-full flex-row items-center justify-start gap-1.5'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-5 w-20' />
                        <Skeleton className='h-5 w-16' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='hidden h-full w-1/3 min-w-[250px] flex-col gap-5 md:flex'>
        <div className='flex h-full w-full flex-col gap-5 pl-5'>
          <div className='flex w-full flex-row items-center justify-between'>
            <p className='text-foreground/70 text-sm font-light'>Upvotes</p>
            <Skeleton className='h-5 w-10' />
          </div>

          <div className='flex w-full flex-row items-center justify-between'>
            <p className='text-foreground/70 text-sm font-light'>Status</p>
            <Skeleton className='h-5 w-[80px]' />
          </div>

          <div className='flex w-full flex-row items-center justify-between'>
            <p className='text-foreground/70 text-sm font-light'>Tags</p>
            <div className='flex w-[100px] gap-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-5 w-20' />
            </div>
          </div>
        </div>

        <Separator className='w-full' />

        <div className='flex h-full w-full flex-col gap-5 pl-5'>
          <div className='flex w-full flex-row items-center justify-between'>
            <p className='text-foreground/70 text-sm font-light'>Created</p>
            <Skeleton className='h-5 w-24' />
          </div>

          <div className='flex w-full flex-row items-center justify-between'>
            <p className='text-foreground/70 text-sm font-light'>Author</p>
            <div className='flex flex-row items-center gap-2 font-light'>
              <Skeleton className='h-7 w-7 rounded-full' />
              <Skeleton className='h-5 w-32' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
