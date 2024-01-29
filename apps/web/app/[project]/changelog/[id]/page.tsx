import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Separator } from '@ui/components/ui/separator';
import { cn } from '@ui/lib/utils';
import { fontMono } from '@ui/styles/fonts';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { getPublicProjectChangelogs } from '@/lib/api/public';
import { formatRootUrl } from '@/lib/utils';
import AnalyticsWrapper from '@/components/hub/analytics-wrapper';
import { Icons } from '@/components/shared/icons/icons-static';

type Props = {
  params: { project: string; id: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get changelogs
  const { data: changelogs, error } = await getPublicProjectChangelogs(params.project, 'server', true, false);

  if (error?.status === 404 || !changelogs) {
    notFound();
  }

  // Get current changelog
  const changelog = changelogs.find((changelog) => changelog.slug === params.id);

  // If changelog is undefined redirects to 404
  if (!changelog) {
    notFound();
  }

  return {
    title: changelog.title,
    description: changelog.summary,
    openGraph: {
      images: [
        {
          url: changelog.image || '',
          width: 1200,
          height: 600,
          alt: changelog.title,
        },
      ],
    },
  };
}

export default async function ChangelogPage({ params }: Props) {
  // Get changelogs
  const { data: changelogs, error } = await getPublicProjectChangelogs(params.project, 'server', true, false);

  // If error.status redirects to 404
  if (error?.status === 404 || !changelogs) {
    notFound();
  }

  // Sort changelogs by publish_date (oldest first)
  changelogs.sort((a, b) => {
    return new Date(b.publish_date!).getTime() - new Date(a.publish_date!).getTime();
  });

  // Get current changelog
  const changelog = changelogs.find((changelog) => changelog.slug === params.id);

  const changelogIndex = changelogs.findIndex((changelog) => changelog.slug === params.id);

  // If changelog is undefined redirects to 404
  if (!changelog) {
    notFound();
  }

  return (
    <AnalyticsWrapper projectSlug={params.project} changelogId={changelog.id}>
      {/* // Row Splitting up date and Content  */}
      <div
        className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'
        key={changelog.id}>
        {/* Back Button */}
        <div className='relative flex'>
          <div className='flex w-full pb-4 md:w-[200px] md:pb-0'>
            <Link href='/changelog' className='h-fit w-fit select-none'>
              <p className='text-foreground/60 hover:text-foreground w-full text-sm font-light transition-colors'>
                ← Back to Changelog
              </p>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className='flex w-full flex-col'>
          <p className='text-foreground/70 w-full pb-4 text-sm font-light'>
            <time className='sticky top-10' dateTime={changelog.publish_date!}>
              {new Date(changelog.publish_date!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </p>

          {/* Title */}
          <h1 className='cursor-default pb-6 text-3xl font-medium'>{changelog.title}</h1>

          {/* Image */}
          <Image
            src={changelog.image || ''}
            alt='Thumbnail'
            width={1200}
            height={600}
            className='rounded-lg border object-cover object-center'
          />

          {/* Author & Share */}
          <div className='flex w-full flex-row items-center justify-between pb-6 pt-4'>
            <div className='flex select-none flex-row items-center gap-3'>
              {/* Author Avatar */}
              <Avatar className='h-10 w-10 border hover:cursor-pointer'>
                <AvatarImage src={changelog.author.avatar_url || ''} alt={changelog.author.full_name} />
                <AvatarFallback className='select-none text-sm font-light'>
                  {changelog.author.full_name[0]}
                </AvatarFallback>
              </Avatar>

              {/* Name & Date */}
              <div className='flex flex-col'>
                <p className='text-foreground/90 text-sm font-medium'>{changelog.author.full_name}</p>
                <p className='text-foreground/70 w-full text-sm font-light'>
                  <time className='sticky top-10' dateTime={changelog.publish_date!}>
                    {new Date(changelog.publish_date!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </p>
              </div>
            </div>

            {/* Share */}
            <div className='text-foreground/70 flex select-none flex-row items-center gap-2 text-sm'>
              {/* Twitter */}
              <Link
                className='text-foreground/70 hover:text-foreground/95 transition-all duration-200 hover:scale-110'
                href={`https://twitter.com/intent/tweet?text=Make sure to check out ${changelog.title} by ${
                  changelog.author.full_name
                }!&url=${formatRootUrl(params.project, `/changelog/${changelog.slug}`)}`}
                target='_blank'
                rel='noopener noreferrer'>
                <Icons.Twitter className='h-6 w-6' />
              </Link>
            </div>
          </div>

          {/* Content as html */}
          <div
            // TODO: Change this to not be html but markdown
            // prose-code:bg-foreground/10 prose-code:rounded-md prose-code:px-1 prose-code:py-0.5 should only be applied if codeblock is not in pre
            className={`${fontMono.variable} prose prose-invert prose-p:font-extralight prose-zinc text-foreground/70 prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code:font-light prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal w-0 min-w-full font-light`}
            // => LUM-32
            dangerouslySetInnerHTML={{ __html: changelog.content! }}
          />

          {/* Separetor */}
          {changelogs.length !== 1 && <Separator className='bg-border/60 mt-8' />}

          {/* Next & Previous */}
          <div
            className={cn(
              'flex w-full flex-row items-center justify-between py-8',
              changelogIndex === 0 && 'justify-end',
              changelogIndex === changelogs.length - 1 && 'justify-start'
            )}>
            {/* Previous */}
            {changelogIndex !== 0 && (
              <div>
                <Link
                  href={`/changelog/${changelogs[changelogIndex - 1]?.slug}`}
                  className='text-foreground/60 hover:text-foreground w-full text-sm font-light transition-colors'>
                  ← {changelogs[changelogIndex - 1]?.title}
                </Link>
              </div>
            )}

            {/* Next */}
            {changelogIndex !== changelogs.length - 1 && (
              <div>
                <Link
                  href={`/changelog/${changelogs[changelogIndex + 1]?.slug}`}
                  className='text-foreground/60 hover:text-foreground w-full text-sm font-light transition-colors'>
                  {changelogs[changelogIndex + 1]?.title} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnalyticsWrapper>
  );
}
