import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProjects } from '@/lib/api/user';
import { DASH_DOMAIN } from '@/lib/constants';
import { SidebarTabsProps } from '@/lib/types';
import DashboardHeader from '@/components/layout/header';
import NavbarMobile from '@/components/layout/nav-bar-mobile';
import Sidebar from '@/components/layout/sidebar';
import TitleProvider from '@/components/layout/title-provider';
import {
  AnalyticsIcon,
  CalendarIcon,
  FeedbackIcon,
  SettingsIcon,
  TagLabelIcon,
} from '@/components/shared/icons/icons-animated';

const tabs: SidebarTabsProps = {
  Modules: [
    {
      name: 'Changelog',
      icon: TagLabelIcon,
      slug: 'changelog',
    },
    {
      name: 'Feedback',
      icon: FeedbackIcon,
      slug: 'feedback',
    },
    {
      name: 'Roadmap (Soon)',
      icon: CalendarIcon,
      slug: 'roadmap',
    },
  ],
  Insights: [
    {
      name: 'Analytics',
      icon: AnalyticsIcon,
      slug: 'analytics',
    },
  ],
  Project: [
    {
      name: 'Settings',
      icon: SettingsIcon,
      slug: 'settings',
    },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Headers
  const headerList = headers();
  const projectSlug = headerList.get('x-project');
  const pathname = headerList.get('x-pathname');

  // Fetch user
  const { data: user } = await getCurrentUser('server');

  if (!user) {
    return redirect(`${DASH_DOMAIN}/login`);
  }

  // Fetch the user's projects
  const { data: projects } = await getUserProjects('server');

  // Check if the user has any projects
  if (!projects || projects.length === 0) {
    return redirect(`${DASH_DOMAIN}`);
  }

  // Get the project with the current slug
  const currentProject = projects.find((project) => project.slug === projectSlug);

  // If currentProject is undefined, redirect to the first project
  if (!currentProject) {
    return redirect(`/${projects[0].slug}`);
  }

  // Retrieve the currently active tab
  const activeTab = Object.values(tabs)
    .flatMap((tabArray) => tabArray)
    .find((tab) => pathname?.includes(tab.slug));

  return (
    <main className='bg-root flex min-h-screen w-full min-w-full justify-center overflow-hidden'>
      <div className='flex h-full w-full flex-col items-center'>
        {/* Header with logo and hub button */}
        {/* BUG: Find a way to solve issue of scroll bar getting removed on avatar dialog open */}
        {/* https://github.com/radix-ui/primitives/discussions/1100 */}
        <DashboardHeader user={user} projects={projects} currentProject={currentProject} />

        <div className='flex h-full w-full flex-row justify-start pt-[64px]'>
          {/* Sidebar */}
          <Sidebar tabs={tabs} initialTab={activeTab || tabs.Modules[0]} currentProject={currentProject} />

          {/* Main content */}
          <div className='flex w-full flex-col items-start justify-start overflow-hidden pb-20 md:pb-0 md:pl-[240px]'>
            <TitleProvider
              tabs={tabs}
              initialTitle={activeTab?.name || tabs.Modules[0].name}
              className='hidden text-3xl font-semibold md:block'
            />
            {children}
          </div>
        </div>

        {/* Navbar (mobile) */}
        <NavbarMobile tabs={tabs} initialTab={activeTab || tabs.Modules[0]} currentProject={currentProject} />
      </div>
    </main>
  );
}
