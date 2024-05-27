'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Label } from '@feedbase/ui/components/label';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Check, Trash2Icon } from 'lucide-react';
import { formatRootUrl } from '@/lib/utils';
import SettingsCard from '@/components/settings/settings-card';
import InputGroup from '@/components/shared/input-group';

export default function DomainSettings() {
  const [redirectRule, setRedirectRule] = useState<'redirect_direct' | 'redirect_root' | 'no_redirect'>(
    'redirect_direct'
  );

  return (
    <SettingsCard title='Custom Domain' description='Host your public hub at your own custom domain.'>
      <div className='col-span-1 -mt-1 w-full space-y-1 '>
        <Label className='text-foreground/70 text-sm '>Domain</Label>
        <div className='flex w-full gap-2'>
          <InputGroup prefix='https://' value='feedbase.com' />
          <Button variant='default' size='icon'>
            <Trash2Icon className='h-4 w-4' />
          </Button>
        </div>
        <Label className='text-muted-foreground text-xs'>
          Want to host on a subpath? Check out our{' '}
          <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
            documentation
          </Link>
          .
        </Label>
      </div>

      <div className='col-span-1 -mt-1 flex h-full w-full flex-col space-y-1'>
        <Label className='text-foreground/70 text-sm '>Redirect Feedbase Subdomain</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-fit'>
              {redirectRule === 'redirect_direct' && 'Redirect direct path'}
              {redirectRule === 'redirect_root' && 'Redirect to root'}
              {redirectRule === 'no_redirect' && "Don't Redirect"}
              <ChevronUpDownIcon className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='redirect_direct'
              onSelect={() => {
                setRedirectRule('redirect_direct');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Redirect direct path</span>
                <span className='text-muted-foreground text-xs'>
                  Redirects to equivalent path on your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'redirect_direct' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='redirect_root'
              onSelect={() => {
                setRedirectRule('redirect_root');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Redirect to root</span>
                <span className='text-muted-foreground text-xs '>
                  Redirects to the root of your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'redirect_root' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='no_redirect'
              onSelect={() => {
                setRedirectRule('no_redirect');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Don&apos;t Redirect</span>
                <span className='text-muted-foreground text-xs '>
                  Does not redirect any requests to your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'no_redirect' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Label className='text-muted-foreground text-xs'>
          Wether to redirect the default feedbase subdomain to your custom domain.
        </Label>
      </div>
    </SettingsCard>
  );
}
