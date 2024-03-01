'use client';

import * as React from 'react';
import { cn } from '@ui/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'ui/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from 'ui/components/ui/dropdown-menu';
import { CreateTagModal } from '../modals/add-tag-modal';

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
  demo?: boolean;
}

export function TagCombobox({
  projectTags,
  initialValue,
  onSelect,
  triggerClassName,
  showDropdownIcon = true,
  align = 'end',
  demo,
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState(initialValue || []);
  const [openColorDialog, setOpenColorDialog] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const EmptyItem = () => {
    if (!search) return null;

    return (
      <>
        <CreateTagModal open={openColorDialog} setOpen={setOpenColorDialog} tagName={search} demo={demo} />
        <CommandItem
          className='flex flex-row items-center gap-2 font-extralight'
          key={search}
          value={search}
          onSelect={() => {
            // Close the dropdown
            setOpenColorDialog(true);
          }}>
          Create tag:&nbsp;<span className='text-foreground/60 font-extralight'>&quot;{search}&quot;</span>
        </CommandItem>
      </>
    );
  };

  const currentTags = projectTags.filter((item) => tags.includes(item.value.toLowerCase()));

  // Use effect on initial value change
  React.useEffect(() => {
    // Set tags to initial value
    setTags(initialValue || []);

    if (!openColorDialog) {
      // Clear search
      setSearch('');

      // Force focus again
      inputRef.current?.focus();
    }
  }, [initialValue, openColorDialog]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-expanded={open}
          variant='outline'
          className={cn(
            'text-foreground/60 flex h-8 w-1/4 items-center justify-between gap-2 font-extralight sm:w-fit',
            triggerClassName
          )}
          size='sm'>
          {/* TODO: Do not nest ternary expressions */}
          {tags && tags.length > 0 ? (
            tags.length === 1 ? (
              <div className='mt-[1px] flex flex-row items-center gap-2 font-extralight '>
                {/* Tag color */}
                <div
                  className='h-2 w-2 rounded-full'
                  style={{
                    backgroundColor: projectTags.find(
                      (item) => item.value.toLowerCase() === tags[0].toLowerCase()
                    )?.color,
                  }}
                />
                {/* Tag name */}
                {projectTags.find((item) => item.value.toLowerCase() === tags[0].toLowerCase())?.label}
              </div>
            ) : (
              <div className='flex flex-row items-center gap-2 font-extralight'>
                {/* Tag colors */}
                <div className='mt-[1px] flex flex-row items-center space-x-[-1.5px]'>
                  {currentTags.map((tag) => (
                    <div
                      className='h-2 w-2 rounded-full'
                      key={tag.value}
                      style={{
                        backgroundColor: tag.color,
                      }}
                    />
                  ))}
                </div>
                {/* Tag name */}
                <span className='text-foreground/60 font-extralight'>{currentTags.length} Tags</span>
              </div>
            )
          ) : (
            'Tags'
          )}

          {/* Icon */}
          {showDropdownIcon ? <ChevronDown className='text-foreground/60 h-4 w-4' /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px] p-0' align={align}>
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
          <CommandInput
            placeholder='Search tags...'
            className='h-9 font-extralight'
            value={search}
            onValueChange={setSearch}
            autoFocus
            ref={inputRef}
          />
          <CommandGroup>
            {projectTags.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setTags((prev) => {
                    if (prev.includes(currentValue)) return prev.filter((tag) => tag !== currentValue);
                    return [...prev, currentValue];
                  });
                  if (onSelect) {
                    const lowerCaseTags = currentTags?.map((tag) => tag.value.toLowerCase());
                    const includesCurrentValue = lowerCaseTags?.includes(currentValue);

                    if (lowerCaseTags && includesCurrentValue) {
                      const filteredTags = lowerCaseTags.filter((tag) => tag !== currentValue);
                      onSelect(filteredTags);
                    } else if (lowerCaseTags) {
                      onSelect([...lowerCaseTags, currentValue]);
                    } else {
                      onSelect([currentValue]);
                    }
                  }
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
            <CommandEmpty className='text-muted-foreground w-full p-2 text-center text-xs font-extralight'>
              No tags found, start typing to create a new tag
            </CommandEmpty>
          </CommandGroup>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
