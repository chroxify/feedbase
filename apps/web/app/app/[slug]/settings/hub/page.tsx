import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import HubConfigCards from '@/components/dashboard/settings/hub-cards';

export default async function HubSettings({ params }: { params: { slug: string } }) {
  // Fetch project data
  const { data: project, error } = await getProjectBySlug(params.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch project config
  const { data: projectConfig, error: configError } = await getProjectConfigBySlug(params.slug, 'server');

  if (configError) {
    return <div>{configError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* Hub Card */}
      <HubConfigCards projectData={project} projectConfigData={projectConfig} />
    </div>
  );
}
