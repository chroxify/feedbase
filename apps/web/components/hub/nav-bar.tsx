'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMetadata } from '@supabase/supabase-js';
import { Button } from '@ui/components/ui/button';
import { cn } from '@ui/lib/utils';
import { satoshi } from '@ui/styles/fonts';
import { ProjectProps } from '@/lib/types';
import UserDropdown from '../shared/user-dropdown';
import AuthModal from './modals/login-signup-modal';

interface TabProps {
  name: string;
  link: string;
}

export default function Header({
  tabs,
  intialTab,
  project,
  user,
}: {
  tabs: TabProps[];
  intialTab: TabProps;
  project: ProjectProps['Row'];
  user: UserMetadata | null;
}) {
  const [currentTab, setCurrentTab] = useState(intialTab);
  const pathname = usePathname();

  // check for tab change
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.link === pathname);
    if (currentTab) {
      setCurrentTab(currentTab);
    }
  }, [pathname, tabs]);

  return (
    <div className='flex w-full flex-col items-center gap-4 px-5 sm:px-10 lg:max-w-screen-xl'>
      {/* Branding & User */}
      <div className='flex w-full flex-row items-center justify-between'>
        {/* Branding */}
        <Link className='flex cursor-pointer select-none flex-row items-center gap-3' href='/'>
          {/* Logo Image */}
          {project?.icon ? (
            <img
              src={project?.icon || ''}
              alt='Logo'
              width={35}
              height={35}
              className={project?.icon_radius || ''}
            />
          ) : null}

          {/* Name */}
          <div
            className={cn(
              satoshi.variable,
              'text-foreground/90 font-satoshi text-center text-xl font-medium'
            )}>
            {project?.name}
          </div>
        </Link>

        {/* Login */}
        {!user ? (
          <AuthModal projectSlug={project?.slug || ''}>
            <Button variant='default'>Login</Button>
          </AuthModal>
        ) : (
          <UserDropdown user={user} />
        )}
      </div>

      {/* Navigation */}
      <div className='flex h-fit w-full flex-row items-center gap-4'>
        {tabs.map((tab) => (
          <Link
            href={tab.link}
            className={cn('pb-[6px] first:-ml-3', tab.link === currentTab.link && 'border-b-2 border-white')}
            key={tab.name.toLowerCase()}>
            <Button
              variant='secondary'
              size='sm'
              className={cn(
                'text-foreground/90 inline-flex items-center rounded-lg px-3 py-1 text-base font-light'
              )}>
              {tab.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
