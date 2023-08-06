'use client';

import { useTheme } from 'next-themes';
import { Icons } from './icons';

export default function LogoProvider() {
  const { theme } = useTheme();

  return (
    <div className='flex w-full flex-row items-center justify-start pb-4'>
      {theme === 'dark' ? (
        <Icons.logoLight className='ml-1 w-32' />
      ) : (
        <Icons.logoDark className='ml-1 w-32' />
      )}
    </div>
  );
}
