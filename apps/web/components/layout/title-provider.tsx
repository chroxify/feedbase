'use client';

import { usePathname } from 'next/navigation';
import { IconObject } from '@/components/shared/icons/icons-animated';

interface TitleProviderProps {
  tabs: {
    name: string;
    icon: IconObject;
    slug: string;
  }[];
  initialTitle: string;
  className?: string;
}

export default function TitleProvider({ tabs, initialTitle, className }: TitleProviderProps) {
  const pathname = usePathname();

  const currentTitle = tabs.find((tab) => pathname?.includes(tab.slug))?.name;

  return <div className={className}>{currentTitle || initialTitle}</div>;
}
