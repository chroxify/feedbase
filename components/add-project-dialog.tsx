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
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function AddProjectDialog({ trigger }: { trigger: React.ReactNode }) {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Replace spaces with dashes
    event.target.value = event.target.value.replace(/\s+/g, '-').toLowerCase();

    setSlug(event.target.value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='p-10 sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>Create a new project to start collecting feedback.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          {/* Project Name */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='name'>Project Name</Label>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className='h-4 w-4 text-foreground/60' />
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
                    <HelpCircle className='h-4 w-4 text-foreground/60' />
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
          <Button type='submit'>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
