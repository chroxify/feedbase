import { Plus } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { Separator } from 'ui/components/ui/separator';
import { getAllProjectChangelogs } from '@/lib/api/changelogs';
import { ApiSheet } from '@/components/dashboard/changelogs/api-sheet';
import ChangelogList from '@/components/dashboard/changelogs/changelog-list';
import { AddChangelogModal } from '@/components/dashboard/modals/add-edit-changelog-modal';

export default async function Changelog({ params }: { params: { slug: string } }) {
  const { data: changelogs, error } = await getAllProjectChangelogs(params.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto'>
      {/* Content */}
      <div className='flex h-full w-full flex-col gap-2'>
        {/* Header Row */}
        {changelogs.length > 0 && (
          <div className='flex h-12 flex-row items-center justify-end gap-3'>
            {/* Api Docs Button */}
            <ApiSheet projectSlug={params.slug} />

            {/* Seperator Line */}
            <Separator orientation='vertical' className='h-7' />

            {/* Create new Button */}
            <AddChangelogModal
              projectSlug={params.slug}
              trigger={
                <Button variant='default' className='font-norm flex items-center gap-1' size='sm'>
                  <Plus className='-ml-[2px] inline-flex h-[18px] w-[18px]' />
                  New Changelog
                </Button>
              }
            />
          </div>
        )}

        {/* Changelog List */}
        {/* If there is no changelog, show empty text in the center */}
        {changelogs.length === 0 && (
          <Card className='mt-10 flex w-full flex-col items-center justify-center p-10 sm:p-20'>
            <CardHeader className='items-center text-center '>
              <CardTitle className='text-2xl font-medium'>No changelogs yet</CardTitle>
              <CardDescription className='font-light'>
                Once you create a changelog, it will show up here.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AddChangelogModal
                projectSlug={params.slug}
                trigger={<Button size='sm'>Create first changelog</Button>}
              />
            </CardFooter>
          </Card>
        )}

        {/* If there is changelog, show changelog list */}
        {changelogs.length > 0 && <ChangelogList changelogs={changelogs} projectSlug={params.slug} />}
      </div>
    </div>
  );
}
