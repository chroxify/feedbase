'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import { Checkbox } from '@feedbase/ui/components/checkbox';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { toast } from 'sonner';
import { formatRootUrl } from '@/lib/utils';
import SettingsCard from '@/components/settings/settings-card';
import CopyCheckIcon from '@/components/shared/copy-check-icon';
import InputGroup from '@/components/shared/input-group';

export default function SSOSettings() {
  const [secret, setSecret] = useState<string>('5mGljDq2JtWG8SF4MHialGky');
  const [hasCopied, setHasCopied] = useState<boolean>();

  return (
    <SettingsCard
      title='Single Sign-On'
      description={
        <>
          Configure single sign-on for your workspace.{' '}
          <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
            Learn more
          </Link>
          .
        </>
      }>
      <div className='col-span-1 -mt-1 w-full space-y-1'>
        <Label className='text-foreground/70 text-sm '>Login Url</Label>
        <Input className='w-full' placeholder='https://example.com/fb/login' />
        <Label className='text-muted-foreground text-xs'>
          The url where users will be redirected to login.
        </Label>
      </div>

      <div className='col-span-1 -mt-1 flex h-full w-full flex-col space-y-1'>
        <Label className='text-foreground/70 text-sm '>JWT Secret</Label>

        <ResponsiveDialog>
          <ResponsiveDialogTrigger asChild>
            <Button variant='outline' className='w-fit'>
              Generate
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className='sm:max-w-[425px]'>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Token Created</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                This token can not be shown again. Please copy it and store it in a safe place.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className='space-y-1 pb-2'>
              <Label className='text-foreground/70 text-sm'>Token</Label>
              <InputGroup
                value={secret}
                groupClassName='px-2 cursor-pointer'
                suffix={
                  <CopyCheckIcon
                    content={secret}
                    className='h-3.5 w-3.5'
                    onCopy={() => {
                      setHasCopied(true);
                    }}
                  />
                }
              />
            </div>

            <ResponsiveDialogFooter className='items-center border-t px-6 py-4 sm:justify-between'>
              <div className='inline-flex flex-row items-center gap-2'>
                <Checkbox
                  checked={hasCopied}
                  onCheckedChange={() => {
                    setHasCopied(!hasCopied);
                  }}
                  id='copied'
                />
                <Label htmlFor='copied' className='text-secondary-foreground cursor-auto text-sm'>
                  I have copied this token
                </Label>
              </div>
              <ResponsiveDialogClose hideCloseButton disabled={!hasCopied}>
                <Button
                  variant='default'
                  disabled={!hasCopied}
                  onClick={() => {
                    toast.success('Token copied to clipboard');
                  }}>
                  Done
                </Button>
              </ResponsiveDialogClose>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>

        <Label className='text-muted-foreground text-xs'>
          The secret used to sign the JWT token on your server.
        </Label>
      </div>
    </SettingsCard>
  );
}
