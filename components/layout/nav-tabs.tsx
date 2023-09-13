'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavbarTabProps } from '@/lib/types';

export default function NavTabs({
  tabs,
  initialTabIndex,
  projectSlug,
}: {
  tabs: NavbarTabProps[];
  initialTabIndex: number;
  projectSlug: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTabIndex);
  const pathname = usePathname();

  // Check current active tab based on url
  useEffect(() => {
    // Check if any of the tab slugs are in the pathname
    const currentTab = tabs.findIndex((tab) => pathname.split('/')[2] === tab.slug);

    // If tab is found, set it as active
    if (currentTab !== -1) {
      setActiveTab(currentTab);
    }
  }, [pathname]);

  return (
    <div className='flex flex-col gap-2'>
      {tabs.map((tab, index) => (
        // If feedback or roadmap, don't link to the page
        <Link
          href={tab.slug === 'feedback' || tab.slug === 'roadmap' ? '#' : `/${projectSlug}/${tab.slug}`}
          key={index}
          className={tab.slug === 'feedback' || tab.slug === 'roadmap' ? 'cursor-default' : ''}>
          <Button
            variant='secondary'
            className={cn(
              'h-fit w-full items-center justify-start gap-2 border border-transparent p-1 text-foreground/80 hover:text-foreground',
              activeTab === index && 'bg-secondary text-foreground'
            )}
            // If feedback or roadmap, disable the button
            disabled={tab.slug === 'feedback' || tab.slug === 'roadmap'}>
            <div
              className={cn(
                'flex flex-row items-center justify-center p-1 text-foreground/40',
                activeTab === index && 'text-foreground'
              )}>
              {tab.icon}
            </div>
            {tab.name} {tab.slug === 'feedback' || tab.slug === 'roadmap' ? '(Soon)' : ''}
          </Button>
        </Link>
      ))}
    </div>
  );
}
