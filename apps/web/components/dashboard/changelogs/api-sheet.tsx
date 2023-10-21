'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from 'ui/components/ui/alert';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ui/components/ui/sheet';
import { formatRootUrl } from '@/lib/utils';
import { CodeIcon } from '@/components/shared/icons/icons-animated';
import LottiePlayer from '@/components/shared/lottie-player';

export function ApiSheet({ projectSlug }: { projectSlug: string }) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
          className='flex items-center gap-2 font-light'>
          <LottiePlayer lottieSrc={CodeIcon} animate={isHover} className='-ml-[2px] h-5 w-5' />
          API
        </Button>
      </SheetTrigger>
      <SheetContent className=''>
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
            <Input value={formatRootUrl('', `/api/v1/${projectSlug}/changelogs`)} readOnly tabIndex={-1} />
            <Button
              variant='default'
              onClick={(event) => {
                navigator.clipboard.writeText(formatRootUrl('', `/api/v1/${projectSlug}/changelogs`));
                toast.success('Copied to clipboard');
              }}>
              Copy Endpoint
            </Button>
          </div>
        </div>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
