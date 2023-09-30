'use client';

import { NavbarTabProps, ProjectProps } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '../shared/icons/icons-static';
import { usePathname } from 'next/navigation';

const navTabs = [
  {
    slug: 'changelog',
    outline: Icons.tagOutline,
    solid: Icons.tagSolid,
  },
  {
    slug: 'roadmap',
    outline: Icons.calendarOutline,
    solid: Icons.calendarSolid,
  },
  {
    slug: 'feedback',
    outline: Icons.feedbackOutline,
    solid: Icons.feedbackSolid,
  },
  {
    slug: 'settings',
    outline: Icons.settingsOutline,
    solid: Icons.settingsSolid,
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
    <div className='fixed bottom-0 z-10 flex h-16 w-full flex-row items-center justify-evenly gap-5 overflow-hidden border-t bg-root px-5 md:hidden'>
      {navTabs.map((tab, index) => (
        // If feedback or roadmap, don't link to the page
        <Link
          href={
            tab.slug === 'feedback' || tab.slug === 'roadmap' ? {} : `/${currentProject.slug}/${tab.slug}`
          }
          key={index}
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
