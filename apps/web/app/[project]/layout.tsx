import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Separator } from 'ui/components/ui/separator';
import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import { getCurrentUser } from '@/lib/api/user';
import Header from '@/components/hub/nav-bar';
import { ThemeProvider } from '@/components/theme-provider';

type Props = {
  children: React.ReactNode;
  params: { project: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get project
  const { data: project, error } = await getProjectBySlug(params.project, 'server', true, false);

  // If project is undefined redirects to 404
  if (error?.status === 404 || !project) {
    notFound();
  }

  return {
    title: project.name,
    description: `Discover the latest updates, roadmaps, submit feedback, and explore more about ${project.name}.`,
    icons: project.icon,
    openGraph: {
      images: [
        {
          url: project.og_image || '',
          width: 1200,
          height: 600,
          alt: project.name,
        },
      ],
    },
  };
}

const tabs = [
  {
    name: 'Feedback',
    link: '/feedback',
  },
  {
    name: 'Changelog',
    link: '/changelog',
  },
];

export default async function HubLayout({ children, params }: Props) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname');
  const currentTab = tabs.find((tab) => tab.link === `/${pathname!.split('/')[1]}`);

  if (!currentTab) {
    redirect('/feedback');
  }

  // Get project data
  const { data: project, error } = await getProjectBySlug(params.project, 'server', true, false);

  if (error?.status === 404 || !project) {
    notFound();
  }

  // Get project config
  const { data: config } = await getProjectConfigBySlug(params.project, 'server', true, false);

  if (!config) {
    notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser('server');

  return (
    <main
      className='bg-root flex min-h-screen min-w-full flex-col justify-between selection:bg-[#8F9EFF]/20 selection:text-[#8F9EFF]'
      style={{
        backgroundColor: config.custom_theme === 'custom' ? `hsl(${config.custom_theme_root})` : undefined,
      }}>
      {/* Custom theming */}
      {config.custom_theme === 'custom' && (
        <style>
          {`
              [data-buttonType='tabs'] {
                color: hsl(${config.custom_theme_primary_foreground} / 0.9) !important;
              }

              [data-buttonType='tabs']:hover {
                background-color: hsl(${config.custom_theme_primary_foreground} / 0.1);
              }

              [data-buttonType="default"] {
                background-color: hsl(${config.custom_theme_background}) !important;
                color: hsl(${config.custom_theme_primary_foreground}) !important;
              }

              [data-buttonType="default"]:hover {
                background-color: hsl(${config.custom_theme_background} / 0.9) !important;
              }

              [data-buttonType="outline"] {
                background-color: hsl(${config.custom_theme_secondary_background}) !important;
              }

              [data-buttonType="outline"]:hover {
                background-color: hsl(${config.custom_theme_secondary_background} / 0.8) !important;
              }

              [data-buttonType='sort'] {
                color: hsl(${config.custom_theme_primary_foreground} / 0.7 ) !important;
              }

              [data-buttonType='sort']:hover {
                color: hsl(${config.custom_theme_primary_foreground} / 0.9) !important;
                background-color: hsl(${config.custom_theme_secondary_background} / 0.8) !important;
              }

              [data-separator] {
                background-color: hsl(${config.custom_theme_border}) !important;
              }

              [data-radix-menu-content] {
                background-color: hsl(${config.custom_theme_root}) !important;
              }

              [data-radix-collection-item]:focus {
                background-color: hsl(${config.custom_theme_primary_foreground} / 0.1);
              }

              [data-radix-collection-item][data-state="active"] {
                background-color: hsl(${config.custom_theme_primary_foreground} / 0.1);
              }

              [role='dialog'] {
                background-color: hsl(${config.custom_theme_root}) !important;
              }

              [cmdk-group] {
                background-color: hsl(${config.custom_theme_root}) !important;
              }

              [cmdk-item][aria-selected='true'] {
                background-color: hsl(${config.custom_theme_primary_foreground} / 0.1);
              }

              [data-accent] {
                color: hsl(${config.custom_theme_accent}) !important;
              }

              [data-accent]:hover {
                color: hsl(${config.custom_theme_primary_foreground} / 0.9) !important;
              }

              [role='tablist'] {
                background-color: hsl(${config.custom_theme_secondary_background} / 0.3) !important;
              }

              [data-description] {
                color: hsl(${config.custom_theme_primary_foreground} / 0.7);
                stroke: hsl(${config.custom_theme_primary_foreground} / 0.7);
              }

              [data-skeleton] {
                background-color: hsl(${config.custom_theme_secondary_background} / 0.3) !important;
              }

              ::selection {
                color: hsl(${config.custom_theme_accent}) !important;
                background-color: hsl(${config.custom_theme_accent} / 0.2) !important;
              }

              ::placeholder {
                color: hsl(${config.custom_theme_primary_foreground} / 0.5) !important;
              }

              * :not([data-description]):not([data-accent]) {
                border-color: hsl(${config.custom_theme_border}) !important;
                color: hsl(${config.custom_theme_primary_foreground}) !important;
              }
            `}
        </style>
      )}

      {/* Theme provider */}
      <ThemeProvider
        attribute='class'
        defaultTheme={
          config.custom_theme === 'custom' ? undefined : config.custom_theme === 'light' ? 'light' : 'dark'
        }>
        {/* Header */}
        <div className='flex h-full w-full flex-col items-center pt-5'>
          {/* Header */}
          <Header tabs={tabs} intialTab={currentTab} project={project} user={user} config={config} />

          {/* Separator with max screen width */}
          <Separator className='bg-border/60' data-separator />

          {/* Main content */}
          <div className='flex h-full w-full flex-col items-start justify-start pt-10 lg:max-w-screen-xl'>
            {children}
          </div>
        </div>
      </ThemeProvider>

      {/* Powered by */}
      {/* TODO: Improve */}
      {/* <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-5 pb-9'>
      <Button
            variant='secondary'
            size='sm'
            className={cn(
              'text-foreground/80 font-light inline-flex items-center rounded-lg px-3 py-1 w-fit text-md hover:text-foreground',
            )}>
            Powered by Feedbase
        </Button>
      </div> */}
    </main>
  );
}
