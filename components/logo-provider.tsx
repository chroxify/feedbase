'use client';

import { useTheme } from 'next-themes';
import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

export default function LogoProvider({
  forceTheme,
  className,
}: {
  forceTheme?: 'dark' | 'light';
  className?: string;
}) {
  const { theme } = useTheme();

  return (
    <div className='flex flex-row items-center justify-start'>
      {theme === 'dark' || forceTheme === 'dark' ? (
        <Icons.logoLight className={cn('ml-1 w-32', className)} />
      ) : (
        <Icons.logoDark className={cn('ml-1 w-32', className)} />
      )}
    </div>
  );
}
