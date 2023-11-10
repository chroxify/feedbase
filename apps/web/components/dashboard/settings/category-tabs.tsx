'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@ui/lib/utils';
import { Button } from 'ui/components/ui/button';
import { CategoryTabProps } from '@/lib/types';

export default function CategoryTabs({
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
  }, [pathname, tabs]);

  return (
    <div className='flex h-10 w-full flex-row items-center gap-4'>
      {tabs.map((tab, index) => (
        <Link href={`/${projectSlug}/settings/${tab.slug}`} key={tab.slug}>
          <Button
            variant='secondary'
            className={cn(
              'text-foreground/70 inline-flex h-fit items-center rounded-lg px-2 py-1 text-sm font-normal',
              activeTab === index && 'bg-secondary text-foreground hover:bg-secondary'
            )}>
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
