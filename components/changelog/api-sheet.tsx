'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Code } from 'lucide-react';
import { toast } from 'sonner';

export function ApiSheet({ projectSlug }: { projectSlug: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Code className='inline-flex h-4 w-4' />
          API
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full'>
        <SheetHeader className='pt-4'>
          <Alert variant='destructive' className='mb-4'>
            <AlertTitle>Early Feature</AlertTitle>
            <AlertDescription>
              Kindly note that this feature is currently in alpha and thus has limited customizability.
            </AlertDescription>
          </Alert>
          <SheetTitle>Changelogs API</SheetTitle>
          <SheetDescription>
            The Changelogs API enables seamless integration of public project updates into your custom
            websites and apps for enhanced personalization.
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-4 pt-4'>
          {/* Endpoint */}
          <div className='flex flex-col gap-2'>
            <Label>Public Endpoint</Label>
            <Input
              value={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/v1/${projectSlug}/changelogs`}
              readOnly
              tabIndex={-1}
            />
            <Button
              variant='default'
              onClick={(event) => {
                navigator.clipboard.writeText(
                  `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/v1/${projectSlug}/changelogs`
                );
                toast.success('Copied to clipboard');
              }}>
              Copy Endpoint
            </Button>
          </div>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
