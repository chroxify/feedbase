import { getUserProjects } from '@/lib/api/projects';
import { redirect } from 'next/navigation';

export default async function Projects() {
  const { data: projects } = await getUserProjects('server');

  // Redirect to the first project
  if (projects.length > 0) {
    return redirect(`/projects/${projects[0].slug}`);
  }
}
