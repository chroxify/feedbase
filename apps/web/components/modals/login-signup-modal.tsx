'use client';

import { useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { Separator } from '@feedbase/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@feedbase/ui/components/tabs';
import { UserAuthForm } from '@/components/user-auth-form';

export default function AuthModal({
  workspaceSlug,
  children,
  disabled,
}: {
  workspaceSlug: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [authType, setAuthType] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <ResponsiveDialog open={disabled ? false : undefined}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='pb-4 sm:max-w-[425px] sm:p-10 sm:py-14'>
        <ResponsiveDialogHeader className='flex flex-col items-center space-y-2'>
          <ResponsiveDialogTitle>{authType === 'sign-in' ? 'Sign In' : 'Sign Up'}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription className='text-center'>
            {authType === 'sign-in' ? 'Sign in' : 'Sign up'} with your email address to continue.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Tabs
          defaultValue='sign-in'
          onValueChange={(value) => {
            setAuthType(value as 'sign-in' | 'sign-up');
          }}>
          <TabsList className='bg-secondary/30 grid w-full grid-cols-2 '>
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
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
