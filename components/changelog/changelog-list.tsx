'use client';

import { ChangelogProps } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';
import { AddChangelogModal } from '../modals/add-edit-changelog.modal';
import { toast } from 'sonner';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function ChangelogList({
  changelogs,
  projectSlug,
}: {
  changelogs: ChangelogProps[];
  projectSlug: string;
}) {
  function formatDate(date: Date) {
    // Convert date to string
    const dateString = date?.toString();

    // Create date object from string
    const dateObject = new Date(dateString);

    return new Date(dateObject).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatData(data: ChangelogProps) {
    if (!data?.publish_date) return data;

    // Convert date to string
    const dateString = data?.publish_date!.toString();

    return {
      ...data,
      publish_date: new Date(dateString),
    };
  }

  async function onDeleteChangelog(changelog: ChangelogProps) {
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
      {changelogs.map((changelog: ChangelogProps) => (
        <div
          className='flex h-48 gap-5 rounded-lg border bg-card p-3 text-card-foreground shadow-sm'
          key={changelog.id}>
          {/* Image */}
          <div className='flex h-full w-full max-w-xs flex-col items-center justify-center'>
            {changelog.image ? (
              <div className='group relative mt-1 flex h-full w-full flex-col items-center justify-center rounded-md border border-input bg-background shadow-sm transition-all hover:bg-accent'>
                <div className='absolute h-full w-full rounded-md'>
                  <Image
                    src={changelog.image}
                    alt='Photo by Drew Beamer'
                    fill
                    sizes='100%'
                    className='rounded-md object-cover'
                  />
                </div>
              </div>
            ) : (
              <div className='group relative mt-1 flex h-full w-full flex-col items-center justify-center rounded-md border border-input bg-background shadow-sm transition-all hover:bg-accent'>
                <div className='absolute flex h-full w-full items-center justify-center rounded-md bg-background'>
                  <div className='flex flex-col items-center justify-center'>
                    <PhotoIcon className='h-8 w-8 text-foreground/50' />
                    <p className='text-sm text-foreground/50'>No image</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className='flex h-full w-full flex-row py-1'>
            {/* Tags */}
            <div className='flex h-full w-[100%] flex-col gap-1 '>
              <div className='flex flex-row gap-2'>
                {/* If published is true, show published badge, else show draft badge */}
                <Badge size='default' variant='secondary' className='self-start'>
                  {changelog.published ? 'Published' : 'Draft'}
                </Badge>

                {/* If date is not undefined, show date */}
                {changelog.publish_date && (
                  <Badge size='default' variant='secondary' className='self-start'>
                    {formatDate(changelog.publish_date)}
                  </Badge>
                )}
              </div>

              {/* Title and Summary */}
              <div className='text-2xl font-semibold'>{changelog.title ? changelog.title : 'Untitled'}</div>
              <div className='text-sm text-foreground/70'>
                {changelog.summary ? changelog.summary : 'No summary provided.'}
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
                    className='h-8 w-5 text-foreground/50 hover:text-foreground'>
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=' justify-between'>
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
                    changelogData={formatData(changelog)}
                    isEdit
                  />

                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive/90'
                    onSelect={() => onDeleteChangelog(changelog)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}