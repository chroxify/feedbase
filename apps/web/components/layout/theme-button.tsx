'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
import { Button } from 'ui/components/ui/button';

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <Button
      variant='secondary'
      className='text-secondary-foreground/40 hover:text-secondary-foreground/90 w-full  items-center justify-start gap-1 border border-transparent p-1 hover:bg-transparent'
      onClick={() => {
        toggleTheme();
      }}>
      <div className='flex flex-row items-center justify-center p-[6px]'>
        {theme === 'dark' ? <SunIcon className='h-5 w-5' /> : <MoonIcon className='h-5 w-5' />}
      </div>
      {theme === 'dark' ? 'Light ' : 'Dark '}
      Mode
    </Button>
  );
}
