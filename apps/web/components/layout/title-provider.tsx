'use client';

import { usePathname } from 'next/navigation';
import { SidebarTabsProps } from '@/lib/types';

interface TitleProviderProps {
  tabs: SidebarTabsProps;
  initialTitle: string;
  className?: string;
}

export default function TitleProvider({ tabs, initialTitle, className }: TitleProviderProps) {
  const pathname = usePathname();

  const currentTitle = Object.values(tabs)
    .flat()
    .find((tab) => pathname.includes(tab.slug))?.name;

  return <div className={className}>{currentTitle || initialTitle}</div>;
}
