import { redirect } from 'next/navigation';
import { Button } from 'ui/components/ui/button';
import { getUserProjects } from '@/lib/api/projects';
import AddProjectDialog from '@/components/dashboard/modals/add-project-modal';

export default async function Projects() {
  const { data: projects, error } = await getUserProjects('server');

  if (error) {
    return <div>{error.message}</div>;
  }

  // Redirect to the first project
  if (projects.length > 0) {
    return redirect(`/${projects[0].slug}`);
  }

  // TODO: Improve this and make this redirect to an onboarding page if the user has no projects
  return (
    <div className='flex h-full w-full flex-col overflow-y-auto'>
      {/* Big Title */}
      <div className='pb-11 text-3xl font-bold'>Projects</div>

      {/* Content */}
      <div className='flex h-full w-full flex-col gap-2'>
        {/* No Projects */}
        <div className='flex flex-col items-center justify-center gap-2 pt-32'>
          <div className='text-2xl font-bold'>No projects yet</div>
          <div className='text-foreground/60 text-center text-lg'>
            Create your first project to get started.
          </div>

          <AddProjectDialog
            trigger={
              <Button size='sm' variant='outline' className='mt-2 flex items-center gap-2'>
                Create first project
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
