'use client';

import * as React from 'react';
import { Checkbox } from '@ui/components/ui/checkbox';
import { cn } from '@ui/lib/utils';
import { ChevronsUpDownIcon, Tags } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'ui/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/ui/popover';
import useTags from '@/lib/swr/use-tags';
import { CreateTagModal } from '../modals/add-tag-modal';

interface TagComboboxProps {
  initialTags: { name: string; color: string }[];
  onTagsChange: (tags: string[]) => void;
}

export function TagCombobox({ initialTags, onTagsChange }: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<{ name: string; color: string }[]>(
    initialTags !== null ? initialTags : []
  );
  const [openColorDialog, setOpenColorDialog] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { tags: projectTags, loading: tagsLoading } = useTags();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const EmptyItem = () => {
    console.log('EMPTY ITEM', search);
    if (!search) return null;

    return (
      <>
        <CreateTagModal open={openColorDialog} setOpen={setOpenColorDialog} tagName={search} />
        <CommandItem
          className='flex flex-row items-center gap-1'
          key={search}
          value={search}
          onSelect={() => {
            // Close the dropdown
            setOpenColorDialog(true);
          }}>
          Create tag: <span className='text-secondary-foreground'>&quot;{search}&quot;</span>
        </CommandItem>
      </>
    );
  };
  // Use effect to clear search when the dialog is closed
  React.useEffect(() => {
    if (!openColorDialog) {
      // Clear search
      setSearch('');

      // Force focus again
      inputRef.current?.focus();
    }
  }, [openColorDialog]);

  // Update selected tags when initial tags change
  React.useEffect(() => {
    setSelectedTags(initialTags);
  }, [initialTags]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='ghost'
          size='sm'
          className='text-secondary-foreground w-1/2 justify-between'>
          {/* Tags */}
          {selectedTags.length > 0 ? (
            <div className='flex flex-row items-center justify-center gap-1.5'>
              {/* Overlapping colors */}
              <div className='flex flex-row gap-1 pl-2'>
                {selectedTags.map((tag, index) => (
                  <div
                    key={tag.name}
                    className='border-root -ml-2 h-2.5 w-2.5 rounded-full border-[1px]'
                    style={{
                      backgroundColor: tag.color,
                      zIndex: selectedTags.length - index,
                    }}
                  />
                ))}
              </div>

              {/* Tag name / count */}
              {selectedTags.length > 1 ? (
                <span>{selectedTags.length} Tags</span>
              ) : (
                <span>{selectedTags[0].name}</span>
              )}
            </div>
          ) : (
            <div className='flex flex-row items-center gap-1.5 '>
              <Tags className='text-foreground/60 h-4 w-4' />
              Tags
            </div>
          )}

          {/* Chevrons */}
          <ChevronsUpDownIcon className='text-muted-foreground h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit min-w-[200px] rounded-lg p-0' align='end'>
        <Command>
          <CommandInput
            placeholder='Add tags...'
            hideIcon
            value={search}
            onValueChange={setSearch}
            autoFocus
            ref={inputRef}
          />
          <CommandEmpty className='text-muted-foreground w-full p-2 text-center text-xs'>
            {tagsLoading ? 'Loading tags...' : 'No tags found, start typing to create a new tag'}
          </CommandEmpty>
          <CommandGroup>
            {projectTags?.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.name}
                className='group space-x-2 rounded-md'
                onSelect={(currentValue) => {
                  // Set tags
                  const newTags = selectedTags.find((t) => t.name.toLowerCase() === currentValue)
                    ? selectedTags.filter((t) => t.name.toLowerCase() !== currentValue)
                    : ([
                        ...selectedTags,
                        projectTags.find((t) => t.name.toLowerCase() === currentValue),
                      ].filter(Boolean) as {
                        name: string;
                        color: string;
                      }[]);

                  // Set tags
                  setSelectedTags(newTags);
                  setOpen(false);

                  // Call onTagsChange
                  let newTagsIds = [] as string[];
                  newTags.map((t) => {
                    projectTags.map((pt) => {
                      if (pt.name === t.name) {
                        newTagsIds.push(pt.id);
                      }
                    });
                  });

                  onTagsChange(newTagsIds);
                }}>
                {/* Checkbox, show on hover except if it's already selected */}
                <Checkbox
                  className={cn(
                    'border-foreground/50 h-3.5 w-3.5 opacity-0 shadow-none group-aria-selected:opacity-100',
                    selectedTags.find((t) => t.name === tag.name) && 'opacity-100'
                  )}
                  iconCn='h-3.5 w-3.5'
                  checked={selectedTags.find((t) => t.name === tag.name) ? true : false}
                />

                <div className='flex flex-row items-center gap-2'>
                  {/* Tag Color */}
                  <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />

                  {/* Tag Name */}
                  {tag.name}
                </div>
              </CommandItem>
            ))}
            <EmptyItem />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
