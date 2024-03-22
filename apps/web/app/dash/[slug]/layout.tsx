import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProjects } from '@/lib/api/user';
import { DASH_DOMAIN } from '@/lib/constants';
import { SidebarTabsProps } from '@/lib/types';
import DashboardHeader from '@/components/layout/header';
import NavbarMobile from '@/components/layout/nav-bar-mobile';
import Sidebar from '@/components/layout/sidebar';
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
    <main className='bg-root flex h-full min-h-screen w-full min-w-full flex-col items-center'>
      {/* Header with logo and hub button */}
      {/* BUG: Find a way to solve issue of scroll bar getting removed on avatar dialog open */}
      {/* https://github.com/radix-ui/primitives/discussions/1100 */}
      <DashboardHeader user={user} projects={projects} currentProject={currentProject} />

      {/* Sidebar */}
      <Sidebar tabs={tabs} initialTab={activeTab || tabs.Modules[0]} currentProject={currentProject} />

      {/* Main content */}
      <div className='absolute right-0 top-14 flex h-[calc(100%-4rem)] w-[calc(100%-240px)] flex-col items-start justify-start overflow-auto pb-20 md:pb-0'>
        {children}
      </div>

      {/* Navbar (mobile) */}
      <NavbarMobile tabs={tabs} initialTab={activeTab || tabs.Modules[0]} currentProject={currentProject} />
    </main>
  );
}
