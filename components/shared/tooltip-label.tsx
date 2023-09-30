import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import DefaultTooltip from './tooltip';

export default function TooltipLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Label htmlFor='name'>{label}</Label>

      <DefaultTooltip content={tooltip}>
        <HelpCircle className='h-4 w-4 cursor-pointer text-foreground/50' />
      </DefaultTooltip>
    </div>
  );
}
