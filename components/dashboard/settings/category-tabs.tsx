'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CategoryTabProps } from '@/lib/types';

export default function SettingsTabs({
  tabs,
  initialTabIndex,
  projectSlug,
}: {
  tabs: CategoryTabProps[];
  initialTabIndex: number;
  projectSlug: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTabIndex);

  const pathname = usePathname();

  // Get the current tab based on the pathname
  useEffect(() => {
    const currentTab = tabs.findIndex((tab) => pathname.split('/')[3] === tab.slug);

    if (currentTab !== -1) {
      setActiveTab(currentTab);
    }
  }, [pathname]);

  return (
    <div className='bg-blue flex h-10 w-full flex-row items-center gap-4'>
      {tabs.map((tab, index) => (
        <Link href={`/${projectSlug}/settings/${tab.slug}`} key={index}>
          <Button
            variant='secondary'
            className={cn(
              'inline-flex h-fit items-center rounded-full px-4 py-1 font-semibold text-foreground/70',
              activeTab === index && 'bg-secondary text-foreground'
            )}>
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
