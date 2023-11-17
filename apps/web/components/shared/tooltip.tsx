import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui/components/ui/tooltip';

export default function DefaultTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild className='select-none'>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <span className='text-foreground/50 text-xs font-normal'>{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
