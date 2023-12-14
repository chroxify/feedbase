import { NavbarTabProps, ProjectProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';

export default async function Sidebar({
  tabs,
  projects,
  activeTabIndex,
  currentProject,
}: {
  tabs: NavbarTabProps[];
  projects: ProjectProps['Row'][];
  activeTabIndex: number;
  currentProject: ProjectProps['Row'];
}) {
  return (
    <div className='fixed z-50 hidden h-full min-w-[200px] flex-col items-center justify-between md:flex'>
      <div className='flex w-full flex-col gap-y-10'>
        {/* Projects */}
        <ProjectDropdown projects={projects} activeProject={currentProject} />

        {/* Main Tabs */}
        <NavTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={currentProject.slug} />
      </div>
      {/* Footer Buttons */}
      {/* <div className='flex w-full flex-col'>
        <Link href='https://github.com/chroxify/feedbase/issues/new' rel='noopener noreferrer' target='_blank'>
          <Button
            variant='secondary'
            className='w-full items-center justify-start  gap-1 border border-transparent p-1 text-secondary-foreground/50 hover:text-secondary-foreground hover:bg-transparent font-light group'>
            <div className='flex flex-row items-center justify-center p-[6px]'>
              <LottiePlayer 
              lottieSrc={ChatIcon}
              animate={true}
              className='h-5 w-5'
              /> 
              <ExclamationCircleIcon className='h-5 w-5' />
              <Icons.chat className='h-[18px] w-[18px] fill-secondary-foreground/50 group-hover:fill-secondary-foreground transition-colors' />
            </div>
            Feedback
          </Button>
        </Link>
        
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
      </div> */}
      {/* <ToggleThemeButton /> */}
    </div>
  );
}
