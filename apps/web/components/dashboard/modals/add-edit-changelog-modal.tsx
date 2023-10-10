'use client';

import { Button } from 'ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui/components/ui/dialog';
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
import { Input } from 'ui/components/ui/input';
import { PublishDatePicker } from '@/components/dashboard/changelogs/date-picker';
import { X } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import FileDrop from '@/components/dashboard/changelogs/image-upload';
import { Textarea } from 'ui/components/ui/textarea';
import Editor from '@/components/dashboard/changelogs/content-editor';
import TooltipLabel from '@/components/shared/tooltip-label';
import { useState } from 'react';
import { ChangelogProps } from '@/lib/types';
import { toast } from 'sonner';

export function AddChangelogModal({
  trigger,
  projectSlug,
  changelogData,
  isEdit,
}: {
  trigger: React.ReactNode;
  projectSlug: string;
  changelogData?: ChangelogProps['Row'];
  isEdit?: boolean;
}) {
  const defaultEditorContent =
    '<p>Write <em>styled</em> <mark>markdown</mark> in <strong>here</strong>.</p><p>Examples:</p><ul><li><p><code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different headings</p></li></ul><ul><li><p><code>==highlight==</code> for <mark>highlighted text</mark></p></li><li><p> <code>**bold**, *italic* and ~~strike~~</code> for <strong>bold</strong>,  <em>italic and <s>strike</s></em></p></li><li><p>and much more like  <code>(c)</code>, <code>-&gt;</code>, <code>&gt;&gt;</code>, <code>1/2</code>, <code>!=</code>, or <code>--</code></p></li></ul>';

  const [data, setData] = useState<ChangelogProps['Row']>({
    id: changelogData?.id || '',
    project_id: changelogData?.project_id || '',
    title: changelogData?.title || '',
    content: changelogData?.content || defaultEditorContent,
    summary: changelogData?.summary || '',
    image: changelogData?.image || null,
    publish_date: changelogData?.publish_date || null,
    published: changelogData?.published || false,
  });

  async function onCreateChangelog(createType: 'draft' | 'publish') {
    // Make sure all required fields are filled out incase published is true
    if (createType === 'publish') {
      if (!data.title || !data.summary || !data.content || !data.image || !data.publish_date) {
        toast.error('Please fill out all required fields.');
        return;
      }
    }

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/changelogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          image: data.image || null,
          publish_date: data.publish_date || null,
          published: createType === 'publish',
        }),
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
      loading: 'Creating changelog...',
      success: `${data.title !== '' ? data.title : 'Draft'} was created successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.href = `/${projectSlug}/changelog`;
    });
  }

  async function onEditChangelog(updateType: 'draft' | 'publish') {
    // Make sure all required fields are filled out incase published is true
    if (updateType === 'publish') {
      if (!data.title || !data.summary || !data.content || !data.image || !data.publish_date) {
        toast.error('Please fill out all required fields.');
        return;
      }
    }

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/changelogs/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          image: data.image || null,
          publish_date: data.publish_date || null,
          published: updateType === 'publish',
        }),
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
      loading: 'Updating changelog...',
      success: `${data.title !== '' ? data.title : 'Draft'} was updated successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.href = `/${projectSlug}/changelog`;
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='max-w-full sm:max-w-2xl lg:max-w-4xl '>
        <DialogHeader>
          <DialogTitle>Create new changelog</DialogTitle>
          <DialogDescription>Provide your users with the latest updates via changelogs.</DialogDescription>
        </DialogHeader>

        {/* 2 Rows with full width, first row has 2 columns, second is full widht */}
        <div className='flex h-full flex-col gap-4'>
          {/* First Row */}
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex h-full w-1/2 flex-col gap-4'>
              <div className='flex flex-row gap-2'>
                {/* Title */}
                <div className='flex w-1/2 flex-col gap-2'>
                  <TooltipLabel label='Title' tooltip='The title of your changelog.' />
                  <Input
                    placeholder='Changelog Title'
                    className='w-full bg-root'
                    onChange={(e) => { setData((prev) => ({ ...prev, title: e.target.value })); }}
                    value={data.title}
                  />
                </div>

                {/* Date */}
                <div className='flex w-1/2 flex-col gap-2'>
                  <TooltipLabel label='Date' tooltip='The publish date of the changelog.' />
                  <PublishDatePicker className='w-full' data={data} setData={setData} />
                </div>
              </div>

              {/* Summary */}
              <div className='flex h-full flex-col gap-2'>
                <TooltipLabel label='Summary' tooltip='A short summary of the changelog.' />
                <Textarea
                  placeholder='Changelog Summary'
                  className='h-20 w-full resize-none items-start justify-start bg-root text-start'
                  onChange={(e) => { setData((prev) => ({ ...prev, summary: e.target.value })); }}
                  // BUG: This should not need another || '' but it does for some reason
                  value={data.summary || ''}
                />
              </div>
            </div>

            {/* Image */}
            <div className='flex h-full w-1/2 flex-col gap-2'>
              <FileDrop data={data} setData={setData} />
            </div>
          </div>

          {/* Markdown Editor */}
          <Editor data={data} setData={setData} />
        </div>
        {/* isEdit or no data changed yet from default */}
        {isEdit ||
        (!data.title &&
          !data.summary &&
          !data.image &&
          !data.publish_date &&
          data.content === defaultEditorContent) ? (
          <DialogClose className='absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100'>
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </DialogClose>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className='absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100' type='button'>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Would you like to save your changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your changes will be lost if you don&apos;t save them and can not be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <DialogClose>
                  <AlertDialogCancel
                    onClick={() => {
                      setData({
                        id: changelogData?.id || '',
                        project_id: changelogData?.project_id || '',
                        title: changelogData?.title || '',
                        content: changelogData?.content || defaultEditorContent,
                        summary: changelogData?.summary || '',
                        image: changelogData?.image || null,
                        publish_date: changelogData?.publish_date || null,
                        published: changelogData?.published || false,
                      });
                    }}>
                    Discard
                  </AlertDialogCancel>
                </DialogClose>
                <AlertDialogAction
                  onClick={() => {
                    onCreateChangelog('draft');
                  }}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <DialogFooter>
          {/* Show Update button if isEdit is true, else show Schedule button */}
          {!isEdit ? (
            <Button variant='outline' type='submit' disabled>
              Schedule
            </Button>
          ) : (
            <Button
              variant={!data.published ? 'outline' : 'default'}
              type='submit'
              onClick={() => {
                onEditChangelog(!data.published ? 'draft' : 'publish');
              }}>
              Update
            </Button>
          )}

          {/* Show Publish button if isEdit is true, else show Create button */}
          {/* Only applies to already published changelogs */}
          {!data.published && (
            <Button
              type='submit'
              onClick={() => {
                // If isEdit is true, then we are editing a changelog, so we want to update it
                if (isEdit) {
                  onEditChangelog('publish');
                } else {
                  onCreateChangelog('publish');
                }
              }}
              disabled={
                data.title === '' ||
                data.summary === '' ||
                data.content === '' ||
                data.content === defaultEditorContent ||
                data.image === null ||
                data.publish_date === null
              }>
              {isEdit ? 'Update & Publish' : 'Publish'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
