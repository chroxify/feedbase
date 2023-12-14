import { getProjectConfigBySlug } from '@/lib/api/projects';
import IntegrationCards from '@/components/dashboard/settings/integration-cards';

export default async function IntegrationsSettings({ params }: { params: { slug: string } }) {
  const { data, error } = await getProjectConfigBySlug(params.slug, 'server');

  if (error) {
    return <div>Error</div>;
  }

  return <IntegrationCards projectSlug={params.slug} projectConfig={data} />;
}
