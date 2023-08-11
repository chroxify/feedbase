'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <Button
      variant='secondary'
      className='w-full items-center justify-start  gap-1 border border-transparent p-1 text-secondary-foreground/60 hover:bg-transparent hover:text-secondary-foreground/90'
      onClick={() => toggleTheme()}>
      <div className='flex flex-row items-center justify-center p-[6px]'>
        {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
      </div>
      {theme === 'dark' ? 'Light ' : 'Dark '}
      Mode
    </Button>
  );
}
