'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'ui/components/ui/button';
import { NavbarTabProps, ProjectProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Icons } from '../shared/icons/icons-static';

const navTabs = [
  {
    slug: 'changelog',
    outline: Icons.TagOutline,
    solid: Icons.TagSolid,
  },
  {
    slug: 'feedback',
    outline: Icons.FeedbackOutline,
    solid: Icons.FeedbackSolid,
  },
  {
    slug: 'roadmap',
    outline: Icons.CalendarOutline,
    solid: Icons.CalendarSolid,
  },
  {
    slug: 'settings',
    outline: Icons.SettingsOutline,
    solid: Icons.SettingsSolid,
  },
];

export default function NavbarMobile({
  tabs,
  activeTabIndex,
  currentProject,
}: {
  tabs: NavbarTabProps[];
  activeTabIndex: number;
  currentProject: ProjectProps['Row'];
}) {
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const pathname = usePathname();

  // Check current active tab based on url
  useEffect(() => {
    // Check if any of the tab slugs are in the pathname
    const currentTab = tabs.findIndex((tab) => pathname.split('/')[2] === tab.slug);

    // If tab is found, set it as active
    if (currentTab !== -1) {
      setActiveTab(currentTab);
    }
  }, [pathname, tabs]);

  return (
    <div className='bg-root fixed bottom-0 z-10 flex h-16 w-full flex-row items-center justify-evenly gap-5 overflow-hidden border-t px-5 md:hidden'>
      {navTabs.map((tab, index) => (
        // If roadmap, don't link to the page
        <Link
          href={tab.slug === 'roadmap' ? {} : `/${currentProject.slug}/${tab.slug}`}
          key={tab.slug}
          className='dr h-full w-full p-3 transition-all duration-150 active:scale-[80%]'>
          <Button
            variant='ghost'
            className={cn(
              'items-centerjustify-center h-full w-full gap-1 border border-transparent p-2 hover:bg-transparent'
            )}>
            {/* Icon */}
            {activeTab === index ? (
              <tab.solid className='h-5 w-5 fill-white' />
            ) : (
              <tab.outline className='h-5 w-5 fill-white' />
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
}
