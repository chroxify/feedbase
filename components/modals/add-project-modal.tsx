'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function AddProjectDialog() {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Replace spaces with dashes
    event.target.value = event.target.value.replace(/\s+/g, '-').toLowerCase();

    setSlug(event.target.value);
  }

  async function onCreateProject() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
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

    toast.promise(promise, {
      loading: 'Creating project...',
      success: `${name} was created successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.href = `/projects/${slug}`;
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
          }}>
          <div className='flex flex-row items-center gap-2'>
            <Plus className='h-4 w-4 text-foreground/60' />
            New Project
          </div>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className='p-10 sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>Create a new project to start collecting feedback.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          {/* Project Name */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='name'>Project Name</Label>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className='h-4 w-4 cursor-pointer text-foreground/60' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is the name of your project on Luminar.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Input
              id='name'
              placeholder='Luminar'
              value={name}
              onChange={(event) => setName(event.target.value)}
              className='col-span-3'
            />
          </div>
          {/* Project Slug */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='slug'>Project Slug</Label>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className='h-4 w-4 cursor-pointer text-foreground/60' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is your project&apos;s unique slug on Luminar.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Input
              id='slug'
              placeholder='luminar'
              value={slug}
              onChange={handleSlugChange}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={() => onCreateProject()}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
