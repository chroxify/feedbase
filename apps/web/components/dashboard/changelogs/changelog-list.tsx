'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Separator } from '@ui/components/ui/separator';
import { Skeleton } from '@ui/components/ui/skeleton';
import { cn } from '@ui/lib/utils';
import { AlertCircle, Copy, Edit, MoreVertical, Trash } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
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
import { fetcher } from '@/lib/utils';
import { AddChangelogModal } from '@/components/dashboard/modals/add-edit-changelog-modal';

export default function ChangelogList({ projectSlug }: { projectSlug: string }) {
  const [tab, setTab] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [changelogs, setChangelogs] = useState<ChangelogProps['Row'][]>();

  const {
    data: changelogsData,
    error,
    isLoading,
    mutate,
  } = useSWR<ChangelogProps['Row'][]>(`/api/v1/projects/${projectSlug}/changelogs`, fetcher);

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
      success: `Changelog deleted successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      mutate();
    });
  }

  async function onDuplicateChangelog(changelog: ChangelogProps['Row']) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/changelogs`, {
        method: 'POST',
        body: JSON.stringify({
          title: changelog.title,
          summary: changelog.summary,
          content: changelog.content,
          image: changelog.image,
          publish_date: new Date().toISOString(),
          published: false,
        }),
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
      loading: 'Duplicating changelog...',
      success: `Changelog duplicated successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      mutate();
    });
  }

  useEffect(() => {
    if (changelogsData) {
      if (tab) {
        const filteredChangelogs = changelogsData.filter((changelog) => {
          if (tab === 'draft') {
            return !changelog.published;
          } else if (tab === 'scheduled') {
            return (
              changelog.published &&
              changelog.publish_date &&
              changelog.publish_date > new Date().toISOString()
            );
          } else if (tab === 'published') {
            return (
              changelog.published &&
              changelog.publish_date &&
              changelog.publish_date <= new Date().toISOString()
            );
          }
          return false;
        });

        // Sort by publish date (newest first)
        filteredChangelogs.sort((a, b) => {
          return new Date(b.publish_date!).getTime() - new Date(a.publish_date!).getTime();
        });

        setChangelogs(filteredChangelogs);
      } else {
        setChangelogs(changelogsData);
      }
    }
  }, [changelogsData, tab]);

  return (
    <>
      {/* Header tabs */}
      <div className='z-10 -mb-[1px] flex w-full flex-row items-center justify-start gap-3 px-5 pt-3'>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'draft' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('draft');
          }}>
          Drafts
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'scheduled' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('scheduled');
          }}>
          Scheduled
        </Button>
        <Button
          variant='ghost'
          className={cn(
            'text-muted-foreground hover:border-muted-foreground h-fit rounded-none border-b border-transparent px-2 py-3 transition-colors hover:bg-transparent',
            tab === 'published' && 'border-foreground text-foreground hover:border-foreground'
          )}
          onClick={() => {
            setTab('published');
          }}>
          Published
        </Button>
      </div>

      <Separator />

      <div className='flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto p-5'>
        {isLoading
          ? [...Array(5)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={`skeleton-${index}`} className='h-32 w-full' />
            ))
          : null}

        {/* Error State */}
        {error && !isLoading ? (
          <div className='flex flex-col items-center gap-4 p-10'>
            <AlertCircle className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
            <div className='space-y-1.5 text-center'>
              <div className='text-secondary-foreground text-center'>
                Failed to load changelogs. Please try again.
              </div>
              {/* Show error message - only hsow if error.message is of type json */}
              {(() => {
                try {
                  return (
                    <p className='text-muted-foreground text-center'>{JSON.parse(error.message)?.error}</p>
                  );
                } catch (parseError) {
                  return null;
                }
              })()}
            </div>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => {
                mutate();
              }}>
              Try Again
            </Button>
          </div>
        ) : null}

        {/* Empty State */}
        {changelogs && changelogs.length === 0 && !error ? (
          <div className='flex flex-col items-center justify-center gap-4 pt-20'>
            <div className='flex flex-col items-center justify-center gap-1'>
              <h3 className='text-foreground text-center text-2xl font-medium'>No changelogs found.</h3>
              <p className='text-muted-foreground text-center'>Create a new changelog to get started.</p>
            </div>
            <AddChangelogModal projectSlug={projectSlug}>
              <Button size='sm'>Create Changelog</Button>
            </AddChangelogModal>
          </div>
        ) : null}

        {/* Changelogs */}
        {changelogs?.map((changelog) => (
          <div
            className='bg-card text-card-foreground flex min-h-[8rem] w-full gap-5 rounded-lg border p-2.5 shadow-sm'
            key={changelog.id}>
            {/* Image */}
            <div className='flex h-full min-w-[190px] flex-col items-center justify-center'>
              {changelog.image ? (
                <div className='border-input bg-background hover:bg-accent group relative h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
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
                <div className='border-input bg-background hover:bg-accent group relative flex h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
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
            <div className='flex h-full w-full flex-col gap-2'>
              {/* Tags */}
              <div className='flex flex-row gap-2'>
                {/* If published is true, show published badge, else show draft badge */}
                <Badge variant='secondary' className='self-start border'>
                  {changelog.published ? 'Published' : 'Draft'}
                </Badge>

                {/* If date is not undefined, show date */}
                {changelog.publish_date ? (
                  <Badge variant='secondary' className='shrink-0 self-start'>
                    {new Date(changelog.publish_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Badge>
                ) : null}
              </div>

              {/* Title and Summary */}
              <div className='flex flex-col'>
                <span className='text-1xl font-medium'>{changelog.title ? changelog.title : 'Untitled'}</span>
                <div className='text-foreground/60 line-clamp-2 text-sm'>
                  {changelog.summary ? changelog.summary : 'No changelog summary provided.'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-foreground/50 hover:text-foreground h-7 w-4'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=' justify-between' align='end'>
                <AddChangelogModal projectSlug={projectSlug} changelogData={changelog} isEdit>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                </AddChangelogModal>
                <DropdownMenuItem
                  onSelect={() => {
                    onDuplicateChangelog(changelog);
                    if (changelog.published) {
                      setTab('draft');
                    }
                  }}>
                  <Copy className='mr-2 h-4 w-4' />
                  {changelog.published ? 'Duplicate in Drafts' : 'Duplicate'}
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      className='text-destructive focus:text-destructive/90 focus:bg-destructive/20'>
                      <Trash className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Changelog</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this changelog? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={() => onDeleteChangelog(changelog)}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </>
  );
}
