'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import { Icons } from '@/components/shared/icons/icons-static';

export default function InviteMemberDialog({
  children,
  projectSlug,
}: {
  children: React.ReactNode;
  projectSlug: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate email
  function validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Send invite
  function sendInvite() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
      loading: 'Sending invitation...',
      success: () => {
        setOpen(false);
        router.refresh();
        setEmail('');
        setIsLoading(false);
        return `Invitation sent!`;
      },
      error: (err) => {
        setIsLoading(false);
        return err;
      },
    });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-[425px]'>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // Send invite
            setIsLoading(true);
            sendInvite();
          }}
          className='flex flex-col gap-4'>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Create Project Invitation</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Invite your team members to collaborate on this project. Invites expire after 7 days.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <div className='flex flex-col gap-4'>
            {/* Project Name */}
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <Label htmlFor='name'>Member&apos;s Email</Label>
              </div>

              <Input
                id='email'
                placeholder='member@feedbase.app'
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                className='col-span-3'
              />

              <Label className='text-foreground/50 text-xs font-extralight'>
                Your team member&apos;s email address.
              </Label>
            </div>
          </div>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose>
              <Button variant='secondary' disabled={isLoading} type='button'>
                Cancel
              </Button>
            </ResponsiveDialogClose>

            <Button type='submit' disabled={email === '' || !validateEmail(email) || isLoading}>
              {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
              Send Invitation
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
