import { ApiSheet } from '@/components/changelog/api-sheet';
import ChangelogList from '@/components/changelog/changelog-list';
import { AddChangelogModal } from '@/components/modals/add-edit-changelog.modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAllProjectChangelogs } from '@/lib/api/changelogs';
import { PlusCircleIcon } from 'lucide-react';

export default async function Changelog({ params }: { params: { slug: string } }) {
  const { data: changelogs } = await getAllProjectChangelogs(params.slug, 'server');

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto'>
      {/* Big Title */}
      <div className='pb-11 text-3xl font-bold'>Changelog</div>

      {/* Content */}
      <div className='flex h-full w-full flex-col gap-2'>
        {/* Header Row */}
        <div className='flex h-12 flex-row items-center justify-end gap-4'>
          {/* Api Docs Button */}
          <ApiSheet projectSlug={params.slug} />

          {/* Seperator Line */}
          <Separator orientation='vertical' className='h-8' />

          {/* Create new Button */}
          <AddChangelogModal
            projectSlug={params.slug}
            trigger={
              <Button variant='default' className='flex items-center gap-2'>
                <PlusCircleIcon className='inline-flex h-4 w-4' />
                New
              </Button>
            }
          />
        </div>

        {/* Changelog List */}
        {/* If there is no changelog, show empty text in the center */}
        {changelogs.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-2 pt-32'>
            <div className='text-2xl font-bold'>No changelogs yet</div>
            <div className='text-center text-lg text-foreground/60'>
              Provide your users with the latest updates via changelogs.
            </div>
            <AddChangelogModal
              projectSlug={params.slug}
              trigger={
                <Button size='sm' variant='outline' className='mt-2 flex items-center gap-2'>
                  Create first changelog
                </Button>
              }
            />
          </div>
        )}

        {/* If there is changelog, show changelog list */}
        {changelogs.length > 0 && <ChangelogList changelogs={changelogs} projectSlug={params.slug} />}
      </div>
    </div>
  );
}
