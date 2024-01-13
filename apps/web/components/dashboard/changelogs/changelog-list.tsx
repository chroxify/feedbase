'use client';

import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'ui/components/ui/alert-dialog';
import { Badge } from 'ui/components/ui/badge';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { ChangelogProps } from '@/lib/types';
import { AddChangelogModal } from '@/components/dashboard/modals/add-edit-changelog-modal';

export default function ChangelogList({
  changelogs,
  projectSlug,
}: {
  changelogs: ChangelogProps['Row'][];
  projectSlug: string;
}) {
  async function onDeleteChangelog(changelog: ChangelogProps['Row']) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/changelogs/${changelog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    toast.promise(promise, {
      loading: 'Deleting changelog...',
      success: `${changelog.title !== '' ? changelog.title : 'Draft'} was deleted successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.reload();
    });
  }

  return (
    <div className='flex flex-col gap-4'>
      {changelogs.map((changelog) => (
        <div
          className='bg-card text-card-foreground flex h-40 gap-5 rounded-lg border p-3 shadow-sm sm:h-44 md:h-48'
          key={changelog.id}>
          {/* Image */}
          <div className='flex h-full w-full max-w-xs flex-col items-center justify-center'>
            {changelog.image ? (
              <div className='border-input bg-background hover:bg-accent group relative mt-1 flex h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
                <div className='absolute h-full w-full rounded-md'>
                  <Image
                    src={changelog.image}
                    alt='Preview Image'
                    fill
                    sizes='100%'
                    className='rounded-md object-cover'
                  />
                </div>
              </div>
            ) : (
              <div className='border-input bg-background hover:bg-accent group relative mt-1 flex h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
                <div className='bg-background absolute flex h-full w-full items-center justify-center rounded-md'>
                  <div className='flex flex-col items-center justify-center'>
                    <PhotoIcon className='text-foreground/50 h-8 w-8' />
                    <p className='text-foreground/50 text-sm'>No image</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className='flex h-full w-full flex-row gap-5 py-1'>
            {/* Tags */}
            <div className='flex h-full w-[100%] flex-col gap-1'>
              <div className='flex flex-row gap-2'>
                {/* If published is true, show published badge, else show draft badge */}
                <Badge size='default' variant='secondary' className='self-start'>
                  {changelog.published ? 'Published' : 'Draft'}
                </Badge>

                {/* If date is not undefined, show date */}
                {changelog.publish_date ? (
                  <Badge size='default' variant='secondary' className='shrink-0 self-start'>
                    {new Date(changelog.publish_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Badge>
                ) : null}
              </div>

              {/* Title and Summary */}
              <div className='text-1xl font-medium'>{changelog.title ? changelog.title : 'Untitled'}</div>
              <div className='text-foreground/60 line-clamp-3 text-sm font-light'>
                {changelog.summary ? changelog.summary : 'No changelog summary provided.'}
              </div>
            </div>

            {/* Actions */}
            {/* Top right corner at very top of card */}
            <div className='flex flex-col justify-between'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='text-foreground/50 hover:text-foreground -mt-1.5 h-8 w-5'>
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=' justify-between' align='end'>
                  <AddChangelogModal
                    projectSlug={projectSlug}
                    trigger={
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}>
                        Edit
                      </DropdownMenuItem>
                    }
                    changelogData={changelog}
                    isEdit
                  />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        className='text-destructive focus:text-destructive/90'>
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Changlog</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this changelog? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-destructive hover:bg-destructive/90 text-foreground'
                          onClick={() => onDeleteChangelog(changelog)}>
                          Yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
