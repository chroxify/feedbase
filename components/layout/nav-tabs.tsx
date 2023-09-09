'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TagIcon, MapIcon, LightBulbIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

const tabs = [
  {
    name: 'Changelogs',
    icon: <TagIcon className='h-5 w-5' />,
    slug: 'changelog',
  },
  {
    name: 'Feedback',
    icon: <LightBulbIcon className='h-5 w-5' />,
    slug: 'feedback',
  },
  {
    name: 'Roadmap',
    icon: <MapIcon className='h-5 w-5' />,
    slug: 'roadmap',
  },
  {
    name: 'Settings',
    icon: <Cog6ToothIcon className='h-5 w-5' />,
    slug: 'settings',
  },
];

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const pathname = usePathname();
  const slug = pathname.split('/')[1];

  // Check current active tab based on url
  useEffect(() => {
    // Check if any of the tab slugs are in the pathname
    const currentTab = tabs.findIndex((tab) => pathname.includes(tab.slug));

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
          href={tab.slug === 'feedback' || tab.slug === 'roadmap' ? '#' : `/${slug}/${tab.slug}`}
          key={index}
          className={tab.slug === 'feedback' || tab.slug === 'roadmap' ? 'cursor-default' : ''}>
          <Button
            variant='secondary'
            className={cn(
              'h-fit w-full items-center justify-start gap-2 border border-transparent p-1 text-foreground/80 hover:text-foreground',
              activeTab === index && 'bg-secondary text-foreground'
            )}
            onClick={() => setActiveTab(index)}
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
