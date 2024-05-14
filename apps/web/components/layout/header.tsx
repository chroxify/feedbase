import { ProfileProps, WorkspaceProps } from '@/lib/types';
import InboxPopover from '@/components/layout/inbox-popover';
import { Icons } from '@/components/shared/icons/icons-static';
import UserDropdown from '@/components/shared/user-dropdown';
import ProjectDropdown from './workspace-dropdown';

export default function DashboardHeader({
  user,
  workspaces,
  currentProject,
}: {
  user: ProfileProps['Row'];
  workspaces: WorkspaceProps['Row'][];
  currentProject: WorkspaceProps['Row'];
}) {
  return (
    <div className='bg-root fixed top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex items-center gap-5'>
        {/* Logo */}
        <Icons.Logo className='fill-foreground -mr-2 h-12 w-fit' />

        {/* Seperator */}
        <div className='bg-border h-5 w-[1px] rotate-[35deg] transform' />

        {/* Workspace */}
        <ProjectDropdown workspaces={workspaces} activeProject={currentProject} />
      </div>

      <div className='flex flex-row items-center gap-2'>
        <InboxPopover user={user} />
        <UserDropdown user={user} />
      </div>
    </div>
  );
}
