'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Label } from '@feedbase/ui/components/label';
import { cn } from '@feedbase/ui/lib/utils';
import { SidebarTabProps, SidebarTabsProps } from '@/lib/types';
import LottiePlayer from '@/components/shared/lottie-player';

export default function NavTabs({
  tabs,
  initialTab,
  projectSlug,
}: {
  tabs: SidebarTabsProps;
  initialTab: SidebarTabProps;
  projectSlug: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab.slug);
  const [isHover, setIsHover] = useState('');
  const pathname = usePathname();

  // Check current active tab based on url
  useEffect(() => {
    // Check if any of the tab slugs are in the pathname
    const rawTabs = Object.values(tabs).flat();
    const currentTab = rawTabs.findIndex((tab) => pathname.includes(tab.slug));

    // If tab is found, set it as active
    if (currentTab !== -1) {
      setActiveTab(rawTabs[currentTab].slug);
    }
  }, [pathname, tabs]);

  return (
    <div className='flex flex-col gap-5'>
      {Object.keys(tabs).map((key) => (
        <div key={key} className='flex flex-col gap-1'>
          <Label className='pb-1 text-xs font-medium'>{key}</Label>
          {tabs[key].map((tab) => (
            <Link
              href={tab.slug === 'roadmap' ? '#' : `/${projectSlug}/${tab.slug}`}
              key={tab.slug}
              className={tab.slug === 'feedback' || tab.slug === 'roadmap' ? 'cursor-default' : ''}>
              <Button
                variant='ghost'
                onMouseEnter={() => {
                  setIsHover(tab.slug);
                }}
                onMouseLeave={() => {
                  setIsHover('');
                }}
                className={cn(
                  'text-foreground/70 hover:text-foreground w-full items-center justify-start gap-1 border border-transparent p-1',
                  activeTab === tab.slug && 'bg-secondary text-foreground hover:bg-secondary'
                )}>
                {/* Icon */}
                <div className='flex transform-none flex-row items-center justify-center p-1'>
                  <LottiePlayer
                    lottieSrc={tab.icon}
                    animate={isHover === tab.slug}
                    className='h-5 w-5'
                    initialColor={
                      activeTab === tab.slug ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.7)'
                    }
                    animationColor='hsl(var(--foreground))'
                  />
                </div>

                {/* Title */}
                {tab.name}
              </Button>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
