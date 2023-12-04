'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui/components/ui/dialog';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';

export function WaitlistModal({
  children,
  keyListener,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  keyListener?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Keyboard shortcut listener for modal
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore if modal is already open
    if (open) return;

    // Open modal on "l" key press
    if (event.key === 'l') {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!keyListener) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  // On submit
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // Validate email address
    const emailRegex = /^\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(?:\.\w{2,4})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Add user to waitlist
    const promise = new Promise((resolve, reject) => {
      fetch('/api/v1/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
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

    // Toast success or error
    toast.promise(promise, {
      loading: 'Adding to waitlist...',
      success: () => {
        setOpen(false);
        setName('');
        setEmail('');
        return 'You have been added to the waitlist!';
      },
      error: (err) => {
        return err;
      },
    });
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-sm rounded-lg p-9 selection:bg-teal-700/20 selection:text-teal-400'>
        <DialogHeader className='flex flex-col items-center pb-2 pt-5'>
          <DialogTitle className='pb-2 font-normal'>Request Access</DialogTitle>
          <DialogDescription className='text-center font-extralight text-white/50'>
            Request access to the Feedbase beta today and we&apos;ll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-5'>
          {/* Name */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='email' className='font-extralight text-white/60'>
                Full Name
              </Label>
            </div>

            <Input
              id='name'
              placeholder='Enter your name'
              tabIndex={-1}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='email' className='font-extralight text-white/60'>
                Email address
              </Label>
            </div>

            <Input
              id='email'
              placeholder='Enter your email'
              type='email'
              value={email}
              tabIndex={-1}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className='w-full justify-center pt-2'>
          <Button
            type='submit'
            className='w-full'
            disabled={name === '' || email === ''}
            onClick={handleSubmit}>
            Request Invite
          </Button>
        </DialogFooter>
        <DialogClose className='focus:ring-transparent' />
      </DialogContent>
    </Dialog>
  );
}
