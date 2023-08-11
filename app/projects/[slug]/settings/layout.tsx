import SettingsTabs from '@/components/settings/category-tabs';

export default function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <main className='flex h-full w-full flex-col overflow-y-auto'>
      {/* Big Title */}
      <div className='pb-3 text-3xl font-bold'>Settings</div>

      {/* Navigation tabs */}
      <SettingsTabs params={params} />

      {/* Content */}
      <div className='flex h-full w-full flex-1 flex-col'>{children}</div>
    </main>
  );
}
