'use client';

import * as React from 'react';
import { cn } from '@ui/lib/utils';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  XCircle,
} from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Command, CommandGroup, CommandItem } from 'ui/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/ui/popover';

export const statusOptions = [
  {
    label: 'Backlog',
    icon: CircleDashed,
  },
  {
    label: 'Planned',
    icon: CircleDotDashed,
  },
  {
    label: 'In Progress',
    icon: CircleDot,
  },
  {
    label: 'Completed',
    icon: CheckCircle2,
  },
  {
    label: 'Rejected',
    icon: XCircle,
  },
];

interface ComboboxProps {
  initialValue?: string | null;
  onSelect?: (value: string) => void;
  triggerClassName?: string;
  showDropdownIcon?: boolean;
  align?: 'start' | 'end';
}

export function StatusCombobox({
  initialValue,
  onSelect,
  triggerClassName,
  showDropdownIcon = true,
  align = 'end',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(initialValue || '');

  const currentItem = statusOptions.find((item) => item.label.toLowerCase() === status.toLowerCase());

  // Use effect on initial value change
  React.useEffect(() => {
    setStatus(initialValue || '');
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='outline'
          className={cn(
            'text-foreground/60 group flex h-8 w-fit items-center justify-between gap-2 font-extralight',
            triggerClassName
          )}
          size='sm'>
          {currentItem ? (
            <div className='flex flex-row items-center gap-[6px] font-extralight'>
              {/* Status icon */}
              <currentItem.icon className='text-foreground/60 group-hover:text-foreground h-4 w-4 transition-colors' />

              {/* Status label */}
              {currentItem.label}
            </div>
          ) : (
            'Status'
          )}

          {/* Icon */}
          {showDropdownIcon ? <ChevronDown className='text-foreground/60 h-4 w-4' /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align={align}>
        <Command>
          <CommandGroup>
            {statusOptions.map((item) => (
              <CommandItem
                key={item.label.toLowerCase()}
                onSelect={(currentValue) => {
                  setStatus(currentValue === status ? '' : currentValue);
                  setOpen(false);
                  onSelect?.(currentItem?.label.toLowerCase() === currentValue ? '' : currentValue);
                }}
                className='flex flex-row items-center gap-[6px] font-extralight'>
                {/* Icon */}
                <item.icon className='text-foreground/80 mt-[1px] h-4 w-4' />

                {/* Status label */}
                {item.label}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    status.toLowerCase() === item.label.toLowerCase() ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
