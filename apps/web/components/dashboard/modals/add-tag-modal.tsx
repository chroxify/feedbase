'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'ui/components/ui/command';

const colors = [
  {
    name: 'Lemon',
    hex: '#FFFACD',
  },
  {
    name: 'Turquoise',
    hex: '#40E0D0',
  },
  {
    name: 'Red',
    hex: '#FF6F61',
  },
  {
    name: 'Lavender',
    hex: '#BB87FC',
  },
  {
    name: 'Green',
    hex: '#85AC82',
  },
  {
    name: 'Pink',
    hex: '#E7A3BE',
  },
  {
    name: 'Yellow',
    hex: '#F4C430',
  },
  {
    name: 'Sky Blue',
    hex: '#E6E6FA',
  },
  {
    name: 'Beige',
    hex: '#FFDAB9',
  },
  {
    name: 'Blue',
    hex: '#6495ED',
  },
];

export function CreateTagModal({
  open,
  setOpen,
  tagName,
  demo,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  tagName: string;
  demo?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const projectSlug = pathname.split('/')[1];

  function onCreateTag(hex: string) {
    if (demo) {
      toast.error('Sign right up to start organizing your feedback!');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tagName,
          color: hex,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        // Reload page
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Search color...' autoFocus className='font-light' />
      <CommandList className='my-2' style={{ scrollbarWidth: 'none' }}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className='p-0'>
          {colors.map((color) => (
            <CommandItem
              key={color.name.toLowerCase()}
              onSelect={() => {
                onCreateTag(color.hex);
                setOpen(false);
              }}
              className='flex h-10 flex-row items-center gap-1 rounded-md font-light hover:cursor-pointer'>
              {/* Color */}
              <div className='ml-2 mt-[1px] h-3 w-3 rounded-full' style={{ backgroundColor: color.hex }} />

              {/* Name */}
              <span className='ml-2'>{color.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
