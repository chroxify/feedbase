import { ProfileProps, ProjectProps } from '@/lib/types';
import InboxPopover from '@/components/layout/inbox-popover';
import { Icons } from '@/components/shared/icons/icons-static';
import UserDropdown from '@/components/shared/user-dropdown';
import ProjectDropdown from './project-dropdown';

export default function DashboardHeader({
  user,
  projects,
  currentProject,
}: {
  user: ProfileProps['Row'];
  projects: ProjectProps['Row'][];
  currentProject: ProjectProps['Row'];
}) {
  return (
    <div className='bg-root fixed top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex items-center gap-5'>
        {/* Logo */}
        <Icons.Logo className='fill-foreground -mr-2 h-12 w-fit' />

        {/* Seperator */}
        <div className='bg-border h-5 w-[1px] rotate-[35deg] transform' />

        {/* Project */}
        <ProjectDropdown projects={projects} activeProject={currentProject} />
      </div>

      <div className='flex flex-row items-center gap-2'>
        <InboxPopover user={user} />
        <UserDropdown user={user} />
      </div>
    </div>
  );
}
