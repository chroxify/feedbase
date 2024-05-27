import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';

export default function SettingsCard({
  title,
  description,
  children,
  className,
  showSave,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showSave?: boolean;
}) {
  return (
    <div className='flex h-fit w-full flex-col justify-between gap-6 p-7'>
      <div className='flex w-full flex-col items-start gap-2 border-b pb-5'>
        <h2 className='text-lg font-normal leading-none tracking-tight'>{title}</h2>
        <p className='text-foreground/50 text-sm '>{description}</p>
      </div>
      <div className={cn('grid w-full grid-cols-2 flex-col items-end justify-center gap-5', className)}>
        {children}

        {showSave ? (
          <div className='col-span-2 flex w-full gap-2'>
            <Button variant='default'>Save</Button>
            <Button variant='outline'>Cancel</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
