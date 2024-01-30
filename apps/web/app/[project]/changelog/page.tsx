import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fontMono } from '@ui/styles/fonts';
import { Separator } from 'ui/components/ui/separator';
import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import { getPublicProjectChangelogs } from '@/lib/api/public';
import AnalyticsWrapper from '@/components/hub/analytics-wrapper';
import SubscribeToEmailUpdates from '@/components/hub/modals/subscribe-email-modal';

type Props = {
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
    title: `Changelog - ${project.name}`,
    description: `All the latest updates, improvements, and fixes to ${project.name}.`,
  };
}

export default async function Changelogs({ params }: Props) {
  // Get changelogs
  const { data: changelogs, error } = await getPublicProjectChangelogs(params.project, 'server', true, false);

  // If error.status redirects to 404
  if (error?.status === 404 || !changelogs) {
    notFound();
  }

  // Sort changelogs by publish_date (newest first)
  changelogs.sort((a, b) => {
    return new Date(b.publish_date!).getTime() - new Date(a.publish_date!).getTime();
  });

  // Get project config
  const { data: projectConfig, error: projectConfigError } = await getProjectConfigBySlug(
    params.project,
    'server',
    true,
    false
  );

  // If error.status redirects to 404
  if (projectConfigError?.status === 404 || !projectConfig) {
    notFound();
  }

  // Get project
  const { data: project, error: projectError } = await getProjectBySlug(
    params.project,
    'server',
    true,
    false
  );

  // If project is undefined redirects to 404
  if (projectError?.status === 404 || !project) {
    notFound();
  }

  return (
    <AnalyticsWrapper className='flex h-full w-full flex-col gap-10' projectSlug={params.project}>
      <div className='flex items-center px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Changelog</h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            All the latest updates, improvements, and fixes to {project.name}.
          </p>

          {/* Buttons */}
          <div className='flex select-none flex-row flex-wrap items-center gap-4 text-sm'>
            {/* Email */}
            <SubscribeToEmailUpdates projectSlug={params.project}>
              <button
                type='button'
                className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
                Subscribe to Updates
              </button>
            </SubscribeToEmailUpdates>

            <span className='text-foreground/70'>·</span>

            {/* Twitter */}
            {projectConfig.changelog_twitter_handle !== null &&
              projectConfig.changelog_twitter_handle !== '' && (
                <div className='flex w-1/2 flex-row items-center gap-4 sm:w-fit'>
                  <Link
                    href={`https://x.com/${projectConfig.changelog_twitter_handle}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
                    Follow us on Twitter
                  </Link>

                  <span className='text-foreground/70 opacity-0 sm:opacity-100'>·</span>
                </div>
              )}

            {/* RRS Update Feed */}
            <Link
              href={`/api/v1/${params.project}/atom`}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
              Subscribe to Atom Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Seperator pushing down date */}
      <Separator className='bg-border/60' />

      {/* Changelogs */}
      <div className='flex flex-col'>
        {changelogs.map((changelog, i: number) => {
          return (
            <>
              {/* // Row Splitting up date and Content  */}
              <div
                className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'
                key={changelog.id}>
                {/* Date */}
                <div className='relative flex'>
                  <div className='flex w-full pb-4 md:w-[200px] md:pb-0'>
                    <p className='text-foreground/60 w-full text-sm font-extralight'>
                      <time className='sticky top-10' dateTime={changelog.publish_date!}>
                        {new Date(changelog.publish_date!).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </p>
                  </div>

                  <div className='relative hidden w-full md:flex md:w-[150px]'>
                    <div className='bg-foreground/70 sticky left-0 top-[46px] mt-1.5 h-1.5 w-1.5 rounded-full' />
                    <div className='bg-foreground/20 absolute left-0.5 top-1 h-full w-[1.5px]' />
                  </div>
                </div>

                {/* Content */}
                <div className='flex w-full flex-col pb-16'>
                  {/* Image */}
                  <Link href={`/changelog/${changelog.slug}`}>
                    <Image
                      src={changelog.image || ''}
                      alt='Thumbnail'
                      width={1200}
                      height={600}
                      className='rounded-lg border object-cover object-center'
                    />
                  </Link>

                  {/* Title */}
                  <div className='pb-4 pt-8'>
                    <Link href={`/changelog/${changelog.slug}`}>
                      <h1 className='text-3xl font-medium decoration-[1px] transition-all duration-1000 hover:underline'>
                        {changelog.title}
                      </h1>
                    </Link>
                  </div>

                  {/* Summary */}
                  {projectConfig.changelog_preview_style === 'summary' && (
                    <p className='text-foreground/70 cursor-default pb-4 text-base font-extralight'>
                      {changelog.summary}
                    </p>
                  )}

                  {projectConfig.changelog_preview_style === 'content' && (
                    <div
                      className={`${fontMono.variable} prose prose-invert prose-p:font-extralight prose-zinc text-foreground/70 prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code:font-light prose-code:bg-foreground/10 prose-code:rounded-md prose-code:px-1 prose-code:py-0.5 prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal font-light`}
                      dangerouslySetInnerHTML={{ __html: changelog.content! }}
                    />
                  )}
                </div>
              </div>

              {/* Separator */}
              {i !== changelogs.length - 1 && <Separator className='bg-border/60 mb-16 block md:hidden' />}
            </>
          );
        })}

        {/* Empty State */}
        {changelogs.length === 0 && (
          <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
            <h1 className='text-foreground/90 text-2xl font-light'>No changelogs yet</h1>
            <p className='text-foreground/60 text-center text-base font-light'>
              The latest updates, improvements, and fixes will be posted here. Stay tuned!
            </p>
          </div>
        )}
      </div>
    </AnalyticsWrapper>
  );
}
