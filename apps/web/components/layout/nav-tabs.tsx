'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@ui/lib/utils';
import { Button } from 'ui/components/ui/button';
import { NavbarTabProps } from '@/lib/types';
import LottiePlayer from '@/components/shared/lottie-player';

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
  const [isHover, setIsHover] = useState('');
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
    <div className='flex flex-col gap-2'>
      {tabs.map((tab, index) => (
        // If roadmap, don't link to the page
        <Link
          href={tab.slug === 'roadmap' ? '#' : `/${projectSlug}/${tab.slug}`}
          key={tab.slug}
          className={tab.slug === 'feedback' || tab.slug === 'roadmap' ? 'cursor-default' : ''}>
          <Button
            variant='secondary'
            onMouseEnter={() => {
              setIsHover(tab.slug);
            }}
            onMouseLeave={() => {
              setIsHover('');
            }}
            className={cn(
              'text-foreground/[85%] hover:text-foreground w-full items-center justify-start gap-1 border border-transparent p-1 font-light',
              activeTab === index && 'bg-secondary text-foreground hover:bg-secondary'
            )}>
            {/* Icon */}
            <div className='flex transform-none flex-row items-center justify-center p-1'>
              <LottiePlayer lottieSrc={tab.icon} animate={isHover === tab.slug} className='h-5 w-5' />
            </div>

            {/* Title */}
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
