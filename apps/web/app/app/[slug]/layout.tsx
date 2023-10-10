import Sidebar from '@/components/layout/sidebar';
import { headers } from 'next/headers';
import { APP_DOMAIN } from '@/lib/constants';
import { getUserProjects } from '@/lib/api/projects';
import { redirect } from 'next/navigation';
import {
  CalendarIcon,
  FeedbackIcon,
  SettingsIcon,
  TagLabelIcon,
} from '@/components/shared/icons/icons-animated';
import { Icons } from '@/components/shared/icons/icons-static';
import UserDropdown from '@/components/layout/user-dropdown';
import { getCurrentUser } from '@/lib/api/user';
import NavbarMobile from '@/components/layout/nav-bar-mobile';
import TitleProvider from '@/components/layout/title-provider';

const tabs = [
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
    name: 'Roadmap',
    icon: CalendarIcon,
    slug: 'roadmap',
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    slug: 'settings',
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Headers
  const headerList = headers();
  const projectSlug = headerList.get('x-project');
  const pathname = headerList.get('x-pathname');

  // Fetch user
  const { data: user } = await getCurrentUser('server');

  if (!user) {
    return redirect(`${APP_DOMAIN}/login`);
  }

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
    <main className='flex min-h-screen min-w-full justify-center overflow-hidden bg-root'>
      <div className='flex h-full w-full flex-col items-center lg:max-w-screen-xl'>
        {/* Header with logo and hub button */}
        {/* BUG: Find a way to solve issue of scroll bar getting removed on avatar dialog open */}
        {/* https://github.com/radix-ui/primitives/discussions/1100 */}
        <div className='fixed top-0 z-50 flex h-16 w-full flex-row items-center justify-between overflow-y-auto bg-root px-5 lg:max-w-screen-xl'>
          {/* Logo */}
          <Icons.logoText className='hidden h-9 fill-foreground pl-1 md:block' />
          <TitleProvider
            tabs={tabs}
            initialTitle={activeTabIndex === -1 ? '' : tabs[activeTabIndex].name}
            className='text-2xl font-semibold md:hidden'
          />
          <UserDropdown user={user} />
        </div>
        <div className='flex h-full w-full flex-row justify-start p-5 pt-[64px]'>
          {/* Sidebar */}
          <Sidebar
            tabs={tabs}
            projects={projects}
            activeTabIndex={activeTabIndex}
            currentProject={currentProject}
          />

          {/* Main content */}
          <div className='flex w-full flex-col items-start justify-start overflow-hidden pb-16 md:pb-0 md:pl-[240px]'>
            <TitleProvider
              tabs={tabs}
              initialTitle={activeTabIndex === -1 ? '' : tabs[activeTabIndex].name}
              className='hidden text-3xl font-semibold md:block'
            />
            {children}
          </div>
        </div>

        {/* Navbar (mobile) */}
        <NavbarMobile tabs={tabs} activeTabIndex={activeTabIndex} currentProject={currentProject} />
      </div>
    </main>
  );
}
