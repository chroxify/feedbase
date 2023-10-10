import { getProjectBySlug } from '@/lib/api/projects';
import { redirect } from 'next/navigation';
import LogoProvider from '@/components/logo-provider';
import { headers } from 'next/headers';

export default async function Header() {
  // Headers
  const headerList = headers();
  const projectSlug = headerList.get('x-project');

  // Get the project
  const { data: project, error } = await getProjectBySlug(projectSlug!, 'server', true);
  console.log(error, project);

  //   If the project doesn't exist, redirect to the homepage
  if (error || !project) {
    redirect(`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  }

  return (
    <div className='w-full px-10 pb-5 lg:max-w-screen-xl'>
      <LogoProvider />
    </div>
  );
}
