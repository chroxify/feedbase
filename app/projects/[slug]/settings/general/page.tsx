import GeneralConfigCards from '@/components/settings/general-cards';
import { getProjectBySlug } from '@/lib/api/projects';

export default async function GeneralSettings({ params }: { params: { slug: string } }) {
  // Fetch project data
  const { data: project } = await getProjectBySlug(params.slug, 'server');

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* General Card */}
      <GeneralConfigCards projectData={project} />
    </div>
  );
}
