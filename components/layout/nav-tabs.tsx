'use client';

import { BadgePlusIcon, Map, MessageCircle, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  {
    name: 'Changelogs',
    icon: <BadgePlusIcon className='h-5 w-5' />,
    slug: 'changelog',
  },
  {
    name: 'Feedback',
    icon: <MessageCircle className='h-5 w-5' />,
    slug: 'feedback',
  },
  {
    name: 'Roadmap',
    icon: <Map className='h-5 w-5' />,
    slug: 'roadmap',
  },
  {
    name: 'Settings',
    icon: <Settings className='h-5 w-5' />,
    slug: 'settings',
  },
];

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const pathname = usePathname();
  const slug = pathname.split('/')[2];

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
        <Link href={`/projects/${slug}/${tab.slug}`} key={index}>
          <Button
            variant='secondary'
            className={cn(
              'h-fit w-full items-center justify-start gap-2 border border-transparent p-1 text-foreground/80 hover:text-foreground',
              activeTab === index && 'bg-secondary text-foreground'
            )}
            onClick={() => setActiveTab(index)}>
            <div
              className={cn(
                'flex flex-row items-center justify-center p-1 text-foreground/70',
                activeTab === index && 'text-foreground'
              )}>
              {tab.icon}
            </div>

            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
