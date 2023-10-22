'use client';

import { useState } from 'react';
import { Separator } from '@ui/components/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/components/ui/tabs';
import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthModal({
  projectSlug,
  children,
  disabled,
}: {
  projectSlug: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [authType, setAuthType] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <Dialog open={disabled ? false : undefined}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='p-10 py-14 sm:max-w-[425px]'>
        <DialogHeader className='flex flex-col items-center space-y-2'>
          <DialogTitle>{authType === 'sign-in' ? 'Sign In' : 'Sign Up'}</DialogTitle>
          <DialogDescription className='text-center'>
            {authType === 'sign-in' ? 'Sign in' : 'Sign up'} with your email address to continue.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue='sign-in'
          onValueChange={(value) => {
            setAuthType(value as 'sign-in' | 'sign-up');
          }}>
          <TabsList className='bg-secondary/30 grid w-full grid-cols-2 font-light'>
            <TabsTrigger value='sign-in'>Sign In</TabsTrigger>
            <TabsTrigger value='sign-up'>Sign Up</TabsTrigger>
          </TabsList>
          <Separator className='bg-border my-4' />
          <TabsContent value='sign-in'>
            <UserAuthForm authType='sign-in' buttonsClassname='bg-secondary/30 border-border/50' />
          </TabsContent>
          <TabsContent value='sign-up'>
            <UserAuthForm authType='sign-up' buttonsClassname='bg-secondary/30 border-border/50' />
          </TabsContent>
        </Tabs>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
