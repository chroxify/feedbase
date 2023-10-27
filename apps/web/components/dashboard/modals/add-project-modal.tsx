'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogCloseWrapper,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui/components/ui/dialog';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';

export default function AddProjectDialog({ trigger }: { trigger: React.ReactNode }) {
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
      window.location.href = `/${slug}`;
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>Create a new project to get started.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Project Name */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='name'>Project Name</Label>
            </div>

            <Input
              id='name'
              placeholder='Luminar'
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              className='col-span-3'
            />

            <Label className='text-foreground/50 text-xs font-extralight'>The name of your project.</Label>
          </div>

          {/* Project Slug */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='slug'>Project Slug</Label>
            </div>

            <div className='bg-background focus-within:ring-ring ring-offset-root flex h-9 w-full rounded-md border text-sm font-extralight transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
              <Input
                className='h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                placeholder='luminar'
                value={slug}
                onChange={handleSlugChange}
              />
              <div className='text-foreground/50 bg-accent flex select-none items-center rounded-r-md border-l px-3 py-2'>
                .luminar.so
              </div>
            </div>

            <Label className='text-foreground/50 text-xs font-extralight'>
              The subdomain of your project.
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogCloseWrapper>
            <Button
              variant='secondary'
              onClick={() => {
                setName('');
                setSlug('');
              }}>
              Cancel
            </Button>
          </DialogCloseWrapper>
          <Button type='submit' onClick={onCreateProject} disabled={name === '' || slug === ''}>
            Create Project
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
