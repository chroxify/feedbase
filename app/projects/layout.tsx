import LogoProvider from '@/components/logo-provider';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const headerList = headers();
  const projectSlug = headerList.get('x-project');

  return (
    <main className='flex min-h-screen min-w-full justify-center bg-muted'>
      <div className='flex h-screen w-full flex-col items-center p-5 lg:max-w-screen-xl'>
        {/* Header with logo and hub button */}
        <div className='flex w-full flex-row items-center justify-between'>
          <LogoProvider className='w-32' />
          <Link href={`/${projectSlug}`} rel='noopener noreferrer' target='_blank'>
            <Button variant='outline' size='sm'>
              Public Hub
            </Button>
          </Link>
        </div>
        <div className='flex h-full w-full flex-row justify-start gap-10'>
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className='flex h-full w-full flex-col items-start justify-start'>{children}</div>
        </div>
      </div>
    </main>
  );
}
