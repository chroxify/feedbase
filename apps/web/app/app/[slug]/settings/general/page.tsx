import { getProjectBySlug } from '@/lib/api/projects';
import GeneralConfigCards from '@/components/dashboard/settings/general-cards';

export default async function GeneralSettings({ params }: { params: { slug: string } }) {
  // Fetch project data
  const { data: project, error } = await getProjectBySlug(params.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* General Card */}
      <GeneralConfigCards projectData={project} />
    </div>
  );
}
