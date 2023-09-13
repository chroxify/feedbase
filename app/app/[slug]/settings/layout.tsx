import SettingsTabs from '@/components/dashboard/settings/category-tabs';
import { headers } from 'next/headers';

const tabs = [
  {
    name: 'General',
    slug: 'general',
  },
  {
    name: 'Team',
    slug: 'team',
  },
  {
    name: 'Integrations',
    slug: 'integrations',
  },
];

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  // Headers
  const headerList = headers();
  const pathname = headerList.get('x-pathname');

  // Retrieve the currently active tab
  const activeTabIndex = tabs.findIndex((tab) => pathname?.split('/')[3] === tab.slug);

  return (
    <main className='flex h-full w-full flex-col overflow-y-auto'>
      {/* Big Title */}
      <div className='pb-3 text-3xl font-bold'>Settings</div>

      {/* Navigation tabs */}
      <SettingsTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={params.slug} />

      {/* Content */}
      <div className='flex h-full w-full flex-1 flex-col'>{children}</div>
    </main>
  );
}
