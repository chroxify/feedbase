'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
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
  }, [pathname]);

  return (
    <div className='bg-blue flex h-10 w-full flex-row items-center gap-4'>
      {tabs.map((tab, index) => (
        <Link href={`/${projectSlug}/settings/${tab.slug}`} key={index}>
          <Button
            variant='secondary'
            className={cn(
              'inline-flex h-fit items-center rounded-lg px-2 py-1 text-sm font-normal text-foreground/70',
              activeTab === index && 'bg-secondary text-foreground hover:bg-secondary'
            )}>
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
