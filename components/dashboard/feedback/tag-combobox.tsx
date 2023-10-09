'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useCommandState } from 'cmdk';

interface TagComboboxProps {
  projectTags: {
    value: string;
    label: string;
    color?: string;
  }[];
  initialValue?: string[] | null;
  onSelect?: (value: string[]) => void;
  triggerClassName?: string;
  showDropdownIcon?: boolean;
  align?: 'start' | 'end';
}

export function TagCombobox({
  projectTags,
  initialValue,
  onSelect,
  triggerClassName,
  showDropdownIcon = true,
  align = 'end',
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState(initialValue || []);

  const EmptyItem = (props: any) => {
    const search = useCommandState((state) => state.search);

    if (!search) return null;
    return (
      <CommandItem {...props} key={search} value={search} className='font-extralight'>
        Create tag:&nbsp;<span className='font-extralight text-foreground/60'>&quot;{search}&quot;</span>
      </CommandItem>
    );
  };

  const currentTags = projectTags.filter((item) => tags.includes(item.value.toLowerCase()));

  // Use effect on initial value change
  React.useEffect(() => {
    setTags(initialValue || []);
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
          {tags && tags.length > 0 ? (
            tags.length == 1 ? (
              <div className='mt-[1px] flex flex-row items-center gap-2 font-extralight '>
                {/* Tag color */}
                <div
                  className='h-2 w-2 rounded-full'
                  style={{
                    backgroundColor: projectTags.find(
                      (item) => item.value.toLowerCase() === tags[0].toLowerCase()
                    )?.color,
                  }}></div>
                {/* Tag name */}
                {projectTags.find((item) => item.value.toLowerCase() === tags[0].toLowerCase())?.label}
              </div>
            ) : (
              <div className='flex flex-row items-center gap-2 font-extralight'>
                {/* Tag colors */}
                <div className='mt-[1px] flex flex-row items-center space-x-[-1.5px]'>
                  {currentTags.map((tag) => (
                    <div
                      className={'h-2 w-2 rounded-full'}
                      key={tag.value}
                      style={{
                        backgroundColor: tag.color,
                      }}></div>
                  ))}
                </div>
                {/* Tag name */}
                <span className='font-extralight text-foreground/60'>{currentTags.length} Tags</span>
              </div>
            )
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
            {projectTags.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setTags((prev) => {
                    if (prev.includes(currentValue)) return prev.filter((tag) => tag !== currentValue);
                    return [...prev, currentValue];
                  });
                  // onSelect?.(currentTags?.label.toLowerCase() === currentValue ? '' : currentValue);
                  onSelect?.(
                    currentTags?.map((tag) => tag.value.toLowerCase())?.includes(currentValue)
                      ? currentTags
                          ?.map((tag) => tag.value.toLowerCase())
                          ?.filter((tag) => tag !== currentValue)
                      : [...currentTags?.map((tag) => tag.value.toLowerCase()), currentValue]
                  );
                }}
                className='flex flex-row items-center gap-2 font-extralight'>
                {/* Tag color */}
                <div className='mt-[1px] h-2 w-2 rounded-full' style={{ backgroundColor: item.color }} />
                {item.label}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    tags.includes(item.value.toLowerCase()) ? 'opacity-100' : 'opacity-0'
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
