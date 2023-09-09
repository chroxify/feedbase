'use client';

import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    name: 'General',
    slug: 'general',
  },
  {
    name: 'Team',
    slug: 'team',
  },
  {
    name: 'Integrations',
    slug: 'integrations',
  },
  // {
  //     name: 'Billing & Usage',
  //     slug: 'billing',
  // },
];

export default function SettingsTabs({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0].slug);

  const pathname = usePathname();

  // Get the current tab based on the pathname
  useEffect(() => {
    const currentTab = tabs.find((tab) => pathname.includes(tab.slug));

    if (currentTab) {
      setActiveTab(currentTab.slug);
    }
  }, [pathname]);

  return (
    <div className='bg-blue flex h-10 w-full flex-row items-center gap-4'>
      {tabs.map((tab) => (
        <Link href={`/${params.slug}/settings/${tab.slug}`} key={tab.slug}>
          <Button
            variant='secondary'
            className={cn(
              'inline-flex h-fit items-center rounded-full px-4 py-1 font-semibold text-foreground/70',
              activeTab === tab.slug && 'bg-secondary text-foreground'
            )}>
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
