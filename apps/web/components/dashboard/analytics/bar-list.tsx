import { Button } from '@ui/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { AnalyticsProps } from '@/lib/types';

type BarListProps = {
  data: AnalyticsProps;
  showData: 'clicks' | 'visitors' | 'both';
  title?: string;
  moreData?: AnalyticsProps;
  maxItems?: number;
};

export default function BarList({ data, showData, title, maxItems }: BarListProps) {
  const max = Math.max(
    ...data.map((d) =>
      showData === 'clicks' ? d.clicks : showData === 'visitors' ? d.visitors : d.clicks + d.visitors
    )
  );

  function calcItemLength(value: number) {
    return (value / max) * 100;
  }

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center gap-3'>
      <div className='flex h-full w-full min-w-0 flex-row items-center justify-between'>
        {/* Bars */}
        <div className='flex h-full w-full flex-col gap-3'>
          {data.slice(0, maxItems ? maxItems + 1 : data.length).map((d) => (
            <div
              className='relative flex h-8 w-full min-w-0 items-center justify-start overflow-hidden'
              key={d.key}>
              <div
                className='bg-secondary/50 absolute h-full w-full rounded-lg'
                style={{
                  width: `${calcItemLength(
                    showData === 'clicks'
                      ? d.clicks
                      : showData === 'visitors'
                      ? d.visitors
                      : d.clicks + d.visitors
                  )}%`,
                }}
              />
              <span className='text-foreground/90 z-10 mx-2 my-1.5 line-clamp-1 h-fit w-full cursor-default text-sm font-light'>
                {d.key}
              </span>
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className='ml-6 flex h-full w-fit flex-col items-end gap-3'>
          {data.slice(0, maxItems ? maxItems + 1 : data.length).map((d) =>
            showData === 'clicks' ? (
              <p className='text-foreground py-1.5 text-sm' key={d.key}>
                {d.clicks}
              </p>
            ) : showData === 'visitors' ? (
              <p className='text-foreground py-1.5 text-sm' key={d.key}>
                {d.visitors}
              </p>
            ) : (
              <div className='flex flex-row gap-6' key={d.key}>
                <p className='text-foreground w-7 py-1.5 text-end text-sm'>{d.visitors}</p>
                <p className='text-foreground w-7 py-1.5 text-end text-sm'>{d.clicks}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* If there are more than maxItems, show a "more" label */}
      {maxItems && data.length > maxItems ? (
        <div className='text-foreground/60 from-root to-root/0 absolute bottom-0 z-10 flex h-20 w-full items-end justify-center bg-gradient-to-t text-sm font-light'>
          <ResponsiveDialog>
            <ResponsiveDialogTrigger>
              <Button
                variant='outline'
                size='sm'
                className='bg-root text-foreground/90 hover:bg-secondary mb-2 rounded-full text-sm font-light'>
                Show more
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent hideDragger className='gap-0 p-0'>
              <ResponsiveDialogHeader className='flex flex-row items-center justify-between space-y-0 border-b px-4 py-6 sm:px-8'>
                <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>

                <div className='flex flex-row items-center justify-between gap-3'>
                  <span className='text-foreground/60 text-sm font-light'>Visitors</span>
                  <span className='text-foreground/60 text-sm font-light'>Views</span>
                </div>
              </ResponsiveDialogHeader>

              <div className='h-full max-h-[600px] w-full overflow-auto px-4 py-4 sm:px-8'>
                <BarList data={data} showData='both' />
              </div>

              <ResponsiveDialogFooter className='border-t px-4 sm:px-8 sm:py-4'>
                <ResponsiveDialogClose className='w-full' hideCloseButton>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-background text-foreground/90 w-full text-sm font-light'>
                    Close
                  </Button>
                </ResponsiveDialogClose>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      ) : null}
    </div>
  );
}
