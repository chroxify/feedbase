'use client';

import * as React from 'react';
import { cn } from '@ui/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Command, CommandGroup, CommandItem } from 'ui/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/ui/popover';

export const sortOptions = ['Newest', 'Oldest', 'Best', 'Worst'];

interface ComboboxProps {
  initialValue?: string | null;
  onSelect?: (value: string) => void;
  align?: 'start' | 'end';
}

export function CommentSortCombobox({ initialValue, onSelect, align = 'end' }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [sort, setSort] = React.useState(initialValue || '');

  const currentItem = sortOptions.find((item) => item.toLowerCase() === sort.toLowerCase());

  // Use effect on initial value change
  React.useEffect(() => {
    setSort(initialValue || '');
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='outline'
          className={cn(
            'text-foreground/60 bg-root hover:bg-accent/50 hover:text-foreground/90 group flex h-7 w-fit items-center justify-between gap-1.5 font-extralight transition-colors'
          )}
          size='sm'>
          {currentItem ? (
            <div className='flex flex-row items-center gap-[6px] font-extralight'>{currentItem}</div>
          ) : (
            'Sort'
          )}

          {/* Icon */}
          <ChevronDown className='text-foreground/60 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[160px] p-0' align={align}>
        <Command>
          <CommandGroup>
            {sortOptions.map((item) => (
              <CommandItem
                key={item.toLowerCase()}
                onSelect={(currentValue) => {
                  setSort(currentValue === sort ? '' : currentValue);
                  setOpen(false);
                  onSelect?.(currentItem?.toLowerCase() === currentValue ? '' : currentValue);
                }}
                className='flex flex-row items-center gap-[6px] font-extralight'>
                {item}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    sort.toLowerCase() === item.toLowerCase() ? 'opacity-100' : 'opacity-0'
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
