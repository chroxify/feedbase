import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToggleThemeButton from './theme-button';
import NavTabs from './nav-tabs';
import { getUserProjects } from '@/lib/api/projects';
import ProjectDropdown from './project-dropdown';
import { headers } from 'next/headers';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Sidebar() {
  // Fetch the user's projects
  const { data: projects, error } = await getUserProjects('server');
  const headerList = headers();

  if (error) {
    return <div>{error.message}</div>;
  }

  // Get the project with the current slug
  const currentProject = projects.find((project) => project.slug === headerList.get('x-project'));

  // If currentProject is undefined, redirect to the first project
  if (!currentProject) {
    return redirect(`/${projects[0].slug}`);
  }

  return (
    <>
      <div className='flex min-w-[200px] flex-col items-center justify-between'>
        <div className='flex w-full flex-col space-y-12'>
          {/* Projects */}
          <ProjectDropdown projects={projects} activeProject={currentProject!} />

          {/* Main Tabs */}
          <NavTabs />
        </div>
        {/* Footer Buttons */}
        <div className='flex w-full flex-col'>
          <Link
            href='https://github.com/chroxify/luminar/issues/new'
            rel='noopener noreferrer'
            target='_blank'>
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
    </>
  );
}
