'use client';

import {
  AlertCircle,
  BadgePlusIcon,
  ChevronsUpDownIcon,
  GlobeIcon,
  LogOut,
  Map,
  MessageCircle,
  Moon,
  Plus,
  Settings,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import AddProjectDialog from '@/components/add-project-dialog';

const tabs = [
  {
    name: 'Changelogs',
    icon: <BadgePlusIcon className='h-5 w-5' />,
    href: '/dashboard/changelog',
  },
  {
    name: 'Feedback',
    icon: <MessageCircle className='h-5 w-5' />,
    href: '/dashboard/feedback',
  },
  {
    name: 'Roadmap',
    icon: <Map className='h-5 w-5' />,
    href: '/dashboard',
  },
  {
    name: 'Settings',
    icon: <Settings className='h-5 w-5' />,
    href: '/dashboard/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Check current active tab based on url
  useEffect(() => {
    const currentTab = tabs.findIndex((tab) => tab.href === pathname);
    setActiveTab(currentTab);
  }, [pathname]);

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <>
      <div className='flex min-w-[200px] flex-col items-center justify-between'>
        <div className='flex w-full flex-col space-y-12'>
          {/* Projects */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='h-fit w-full justify-between p-1'>
                <div className='flex flex-row items-center justify-start gap-2'>
                  <div className='flex flex-row items-center justify-center rounded-sm bg-accent p-[6px]'>
                    <GlobeIcon className='h-4 w-4 text-foreground/60' />
                  </div>
                  Projects
                </div>
                <ChevronsUpDownIcon className='h-4 w-4 text-foreground/60' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[200px] justify-between'>
              <DropdownMenuItem>Project 1</DropdownMenuItem>
              <DropdownMenuItem>Project 2</DropdownMenuItem>
              <DropdownMenuItem>Project 3</DropdownMenuItem>
              <AddProjectDialog
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                    }}>
                    <div className='flex flex-row items-center gap-2'>
                      <Plus className='h-4 w-4 text-foreground/60' />
                      New Project
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Main Tabs */}
          <div className='flex flex-col gap-2'>
            {tabs.map((tab, index) => (
              <Button
                variant='secondary'
                className={cn(
                  'h-fit w-full items-center justify-start gap-2 border border-accent p-1 text-foreground/80 hover:text-foreground',
                  activeTab === index && 'bg-secondary text-foreground'
                )}
                key={index}
                onClick={() => setActiveTab(index)}>
                <div
                  className={cn(
                    'flex flex-row items-center justify-center p-1 text-foreground/70',
                    activeTab === index && 'text-foreground'
                  )}>
                  {tab.icon}
                </div>

                {tab.name}
              </Button>
            ))}
          </div>
        </div>
        {/* Footer Buttons */}
        <div className='flex w-full flex-col'>
          <Button
            variant='secondary'
            className='w-full items-center justify-start  gap-1 border border-accent p-1 text-secondary-foreground/60 hover:bg-transparent hover:text-secondary-foreground/90'>
            <div className='flex flex-row items-center justify-center p-[6px]'>
              <AlertCircle className='h-5 w-5' />
            </div>
            Give Feedback
          </Button>
          <Button
            variant='secondary'
            className='w-full items-center justify-start  gap-1 border border-accent p-1 text-secondary-foreground/60 hover:bg-transparent hover:text-secondary-foreground/90'
            onClick={() => toggleTheme()}>
            <div className='flex flex-row items-center justify-center p-[6px]'>
              {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
            </div>
            {theme === 'dark' ? 'Light ' : 'Dark '}
            Mode
          </Button>
          <form action='/auth/sign-out' method='post'>
            <Button
              variant='secondary'
              className='w-full items-center justify-start  gap-1 border border-accent p-1 text-secondary-foreground/60 hover:bg-transparent hover:text-secondary-foreground/90'>
              <div className='flex flex-row items-center justify-center p-[6px]'>
                <LogOut className='h-5 w-5' />
              </div>
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
