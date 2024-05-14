'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';
import { satoshi } from '@feedbase/ui/styles/fonts';
import { ProfileProps, WorkspaceConfigWithoutSecretProps, WorkspaceProps } from '@/lib/types';
import { hslToHex } from '@/lib/utils';
import UserDropdown from '../shared/user-dropdown';
import AuthModal from './modals/login-signup-modal';

interface TabProps {
  name: string;
  link: string;
}

export default function Header({
  tabs,
  intialTab,
  workspace,
  config,
  user,
}: {
  tabs: TabProps[];
  intialTab: TabProps;
  workspace: WorkspaceProps['Row'];
  config: WorkspaceConfigWithoutSecretProps;
  user: ProfileProps['Row'] | null;
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
        <Link
          className='flex cursor-pointer select-none flex-row items-center gap-3'
          href={config.logo_redirect_url || '/'}>
          {/* Logo Image */}
          {workspace?.icon ? (
            <img
              src={workspace?.icon || ''}
              alt='Logo'
              width={35}
              height={35}
              className={workspace?.icon_radius || ''}
            />
          ) : null}

          {/* Name */}
          <div
            className={cn(
              satoshi.variable,
              'text-foreground/90 font-satoshi text-center text-xl font-medium'
            )}>
            {workspace?.name}
          </div>
        </Link>

        {/* User */}
        {user ? (
          <UserDropdown
            user={user}
            iconColor={
              config.workspace_theme === 'custom'
                ? hslToHex(config.custom_theme_primary_foreground)
                : undefined
            }
          />
        ) : null}

        {/* Login */}
        {!config.integration_sso_status && !user && (
          <AuthModal projectSlug={workspace?.slug || ''}>
            <Button variant='default'>Login</Button>
          </AuthModal>
        )}

        {/* SSO */}
        {config.integration_sso_status && !user ? (
          <Link href={config.integration_sso_url || ''}>
            <Button variant='default'>Login with {workspace?.name}</Button>
          </Link>
        ) : null}
      </div>

      {/* Navigation */}
      <div className='flex h-fit w-full flex-row items-center gap-4'>
        {tabs.map((tab) => (
          <Link
            href={tab.link}
            className={cn(
              'pb-[6px] first:-ml-3',
              tab.link === currentTab.link && 'border-foreground border-b-2'
            )}
            key={tab.name.toLowerCase()}>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'text-foreground/90 hover:bg-foreground/10 inline-flex items-center rounded-md px-3 py-1 text-base  transition-colors duration-150',
                tab.link === currentTab.link && ''
              )}>
              {tab.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
