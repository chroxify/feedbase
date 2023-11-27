'use client';

import { useState } from 'react';
import { cn } from '@ui/lib/utils';
import { Check, ChevronDownIcon } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';

export default function AddApiKeyDialog({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string>('');
  const [permissions, setPermissions] = useState<'public_access' | 'full_access'>('public_access');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new API Key</DialogTitle>
          <DialogDescription>Create a new API key for your project.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Project Name */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='name'>Name</Label>
            </div>

            <Input
              id='name'
              placeholder='Production SDK'
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              className='col-span-3'
            />

            <Label className='text-foreground/50 text-xs font-extralight'>
              The name of your API key. (used for identification)
            </Label>
          </div>

          {/* Project Slug */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label>Permissions</Label>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full justify-between font-extralight'>
                  {permissions === 'public_access' ? 'Public Access' : 'Full Access'}
                  <ChevronDownIcon className='text-muted-foreground ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' defaultValue={permissions}>
                <DropdownMenuItem
                  className='flex flex-row items-center gap-7 px-4 py-2'
                  key='public_access'
                  onSelect={() => {
                    setPermissions('public_access');
                  }}>
                  <div className='flex flex-col items-start'>
                    <p>Public Access</p>
                    <p className='text-foreground/70 text-sm font-extralight'>
                      View and create public available resources.
                    </p>
                  </div>

                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      permissions === 'public_access' ? 'text-primary' : 'text-transparent'
                    )}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='flex flex-row items-center px-4 py-2'
                  key='full_access'
                  onSelect={() => {
                    setPermissions('full_access');
                  }}>
                  <div className='flex flex-col items-start'>
                    <p>Full Access</p>
                    <p className='text-foreground/70 text-sm font-extralight'>
                      Admin-level access to all project resources.
                    </p>
                  </div>

                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      permissions === 'full_access' ? 'text-primary' : 'text-transparent'
                    )}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Label className='text-foreground/50 text-xs font-extralight'>
              The permission scopes of your API key.
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogCloseWrapper>
            <Button
              variant='secondary'
              onClick={() => {
                setName('');
              }}>
              Cancel
            </Button>
          </DialogCloseWrapper>
          <Button type='submit' disabled={name === ''}>
            Create Key
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
