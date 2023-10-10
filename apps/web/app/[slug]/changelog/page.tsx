import { Separator } from 'ui/components/ui/separator';
import { getPublicProjectChangelogs } from '@/lib/api/public';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Changelog({ params }: { params: { slug: string } }) {
  // Get changelogs
  const { data: changelogs, error } = await getPublicProjectChangelogs(params.slug, 'server', true);

  // If error.status redirects to 404
  if (error?.status === 404 || !changelogs) {
    notFound();
  }

  // Sort changelogs by publish_date (newest first)
  changelogs.sort((a, b) => {
    return new Date(b.publish_date!).getTime() - new Date(a.publish_date!).getTime();
  });

  return (
    <div className='flex h-full w-full flex-col gap-10 overflow-y-auto lg:px-10'>
      <div className='flex flex-col items-center justify-center gap-4 px-10'>
        <h1 className='text-5xl font-bold'>Changelog</h1>
        <p className='text-lg text-foreground/70'>
          All the latest updates, improvements, and fixes to{' '}
          {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}.
        </p>
      </div>

      <Separator className='bg-border/60' />

      <div className='flex h-full w-full flex-col items-center justify-center gap-20'>
        {changelogs.map((changelog, i: number) => {
          return (
            <>
              {/* Row Splitting up date and Content */}
              <div className='flex h-full w-full flex-row px-20' key={changelog.id}>
                {/* Date */}
                <div className='flex w-1/4 flex-row'>
                  {/* Date in format Month Name day, year */}
                  {new Date(changelog.publish_date!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {/* Content */}
                <div className='flex w-3/4 flex-col'>
                  {/* Image */}
                  <Image
                    src={changelog.image || ''}
                    alt='Thumbnail'
                    width={1200}
                    height={600}
                    className='rounded-lg'
                  />

                  {/* Title */}
                  <h1 className='cursor-default pb-4 pt-10 text-3xl font-bold'>{changelog.title}</h1>

                  {/* Content as html */}
                  <div
                    className='prose text-lg dark:prose-invert'
                    // TODO: Change this to not be html but markdown
                    // => LUM-32
                    dangerouslySetInnerHTML={{ __html: changelog.content! }}
                  />
                </div>
              </div>
              {/* Incase changelog is not the last one */}
              {i !== changelogs.length - 1 && <Separator className='bg-border/60' />}
            </>
          );
        })}

        {/* Incase there are no changelogs */}
        {changelogs.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className='text-3xl font-bold'>No changelogs yet!</h1>
            <p className='text-lg text-foreground/70'>
              There are currently no changelogs for{' '}
              {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}. Make sure to check back later!
            </p>
          </div>
        )}
      </div>

      {/* Show only if there are changelogs */}
      {changelogs.length !== 0 && (
        <>
          <Separator className='bg-border/60' />

          {/* Footer */}
          <div className='flex flex-row items-center justify-center px-10 pb-3'>
            Powered by&nbsp;
            <Link href='https://luminar.so' className='font-semibold hover:underline'>
              Luminar
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
