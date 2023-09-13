import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToggleThemeButton from '@/components/layout/theme-button';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { NavbarTabProps, ProjectProps } from '@/lib/types';

export default async function Sidebar({
  tabs,
  projects,
  activeTabIndex,
  currentProject,
}: {
  tabs: NavbarTabProps[];
  projects: any;
  activeTabIndex: number;
  currentProject: ProjectProps['Row'];
}) {
  return (
    <div className='flex min-w-[200px] flex-col items-center justify-between'>
      <div className='flex w-full flex-col space-y-12'>
        {/* Projects */}
        <ProjectDropdown projects={projects} activeProject={currentProject!} />

        {/* Main Tabs */}
        <NavTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={currentProject.slug} />
      </div>
      {/* Footer Buttons */}
      <div className='flex w-full flex-col'>
        <Link href='https://github.com/chroxify/luminar/issues/new' rel='noopener noreferrer' target='_blank'>
          <Button
            variant='secondary'
            className='w-full items-center justify-start  gap-1 border border-transparent p-1 text-secondary-foreground/40 hover:bg-transparent hover:text-secondary-foreground/90'>
            <div className='flex flex-row items-center justify-center p-[6px]'>
              <ExclamationCircleIcon className='h-5 w-5' />
            </div>
            Give Feedback
          </Button>
        </Link>
        <ToggleThemeButton />
        <form action='/auth/sign-out' method='post'>
          <Button
            variant='secondary'
            className='w-full items-center justify-start  gap-1 border border-transparent p-1 text-secondary-foreground/40 hover:bg-transparent hover:text-secondary-foreground/90'>
            <div className='flex flex-row items-center justify-center p-[6px]'>
              <LogOut className='h-5 w-5' />
            </div>
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
