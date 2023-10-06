'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useCommandState } from 'cmdk';

interface TagComboboxProps {
  tags: {
    value: string;
    label: string;
    color?: string;
  }[];
  initialValue?: string | null;
  onSelect?: (value: string) => void;
  triggerClassName?: string;
  showDropdownIcon?: boolean;
  align?: 'start' | 'end';
}

export function TagCombobox({
  tags,
  initialValue,
  onSelect,
  triggerClassName,
  showDropdownIcon = true,
  align = 'end',
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [tag, setTag] = React.useState(initialValue || '');

  const EmptyItem = (props: any) => {
    const search = useCommandState((state) => state.search);

    if (!search) return null;
    return (
      <CommandItem {...props} key={search} value={search} className='font-extralight'>
        Create tag:&nbsp;<span className='font-extralight text-foreground/60'>&quot;{search}&quot;</span>
      </CommandItem>
    );
  };

  const currentTag = tags.find((item) => item.value.toLowerCase() === tag.toLowerCase());

  // Use effect on initial value change
  React.useEffect(() => {
    setTag(initialValue || '');
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='outline'
          className={cn(
            'flex h-8 w-1/4 items-center justify-between gap-2 font-extralight text-foreground/60 sm:w-fit',
            triggerClassName
          )}
          size='sm'>
          {tag ? (
            <div className='flex flex-row items-center gap-2 font-extralight'>
              {/* Tag color */}
              <div
                className='h-2 w-2 rounded-full'
                style={{
                  backgroundColor: tags.find((item) => item.value.toLowerCase() === tag.toLowerCase())?.color,
                }}></div>
              {/* Tag name */}
              {tags.find((item) => item.value.toLowerCase() === tag.toLowerCase())?.label}
            </div>
          ) : (
            'Tags'
          )}

          {/* Icon */}
          {showDropdownIcon && <ChevronDown className='h-4 w-4 text-foreground/60' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align={align}>
        <Command
          filter={(value, search) => {
            // If whitespace in search, split and search for each word
            if (search.includes(' ')) {
              const searchTerms = search.split(' ');
              for (const term of searchTerms) {
                if (!value.includes(term.toLowerCase())) return 0;
              }
              return 1;
            }

            if (value.includes(search.toLowerCase())) return 1;

            return 0;
          }}>
          <CommandInput placeholder='Search tags...' className='h-9 font-extralight' />
          <CommandGroup>
            {tags.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setTag(currentValue === tag ? '' : currentValue);
                  setOpen(false);
                  onSelect?.(currentTag?.label.toLowerCase() === currentValue ? '' : currentValue);
                }}
                className='flex flex-row items-center gap-2 font-extralight'>
                {/* Tag color */}
                <div className='mt-[1px] h-2 w-2 rounded-full' style={{ backgroundColor: item.color }} />
                {item.label}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    tag.toLowerCase() === item.value.toLowerCase() ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
            <EmptyItem />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
