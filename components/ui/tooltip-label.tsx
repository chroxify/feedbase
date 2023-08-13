import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export default function TooltipLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Label htmlFor='name'>{label}</Label>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className='h-4 w-4 cursor-pointer text-foreground/60' />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
