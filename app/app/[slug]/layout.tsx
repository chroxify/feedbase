import LogoProvider from '@/components/logo-provider';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { headers } from 'next/headers';
import { APP_DOMAIN } from '@/lib/constants';
import { TagIcon, MapIcon, LightBulbIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { getUserProjects } from '@/lib/api/projects';
import { redirect } from 'next/navigation';

const tabs = [
  {
    name: 'Changelogs',
    icon: <TagIcon className='h-5 w-5' />,
    slug: 'changelog',
  },
  {
    name: 'Feedback',
    icon: <LightBulbIcon className='h-5 w-5' />,
    slug: 'feedback',
  },
  {
    name: 'Roadmap',
    icon: <MapIcon className='h-5 w-5' />,
    slug: 'roadmap',
  },
  {
    name: 'Settings',
    icon: <Cog6ToothIcon className='h-5 w-5' />,
    slug: 'settings',
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Headers
  const headerList = headers();
  const projectSlug = headerList.get('x-project');
  const pathname = headerList.get('x-pathname');

  // Fetch the user's projects
  const { data: projects } = await getUserProjects('server');

  // Check if the user has any projects
  if (!projects || projects.length === 0) {
    return redirect(`${APP_DOMAIN}`);
  }

  // Get the project with the current slug
  const currentProject = projects.find((project) => project.slug === projectSlug);

  // If currentProject is undefined, redirect to the first project
  if (!currentProject) {
    return redirect(`/${projects[0].slug}`);
  }

  // Retrieve the currently active tab
  const activeTabIndex = tabs.findIndex((tab) => pathname?.includes(tab.slug));

  return (
    <main className='flex min-h-screen min-w-full justify-center bg-muted'>
      <div className='flex h-screen w-full flex-col items-center p-5 lg:max-w-screen-xl'>
        {/* Header with logo and hub button */}
        <div className='flex w-full flex-row items-center justify-between pb-4'>
          <LogoProvider className='w-32' />
          <Link href={APP_DOMAIN.replace('app', projectSlug!)} rel='noopener noreferrer' target='_blank'>
            <Button variant='outline' size='sm'>
              Public Hub
            </Button>
          </Link>
        </div>
        <div className='flex h-full w-full flex-row justify-start gap-10'>
          {/* Sidebar */}
          <Sidebar
            tabs={tabs}
            projects={projects}
            activeTabIndex={activeTabIndex}
            currentProject={currentProject}
          />

          {/* Main content */}
          <div className='flex h-full w-full flex-col items-start justify-start'>{children}</div>
        </div>
      </div>
    </main>
  );
}
