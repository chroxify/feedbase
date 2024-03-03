'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { cn } from '@ui/lib/utils';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { PROSE_CN } from '@/lib/constants';
import { FeedbackTagProps, FeedbackWithUserProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';
import CommentEditor from '../../shared/tiptap-editor';
import { StatusCombobox } from '../feedback/status-combobox';
import { TagCombobox } from '../feedback/tag-combobox';

export default function FeedbackModal({
  tags,
  feedback,
  feedbackList,
  setFeedbackList,
  children,
  className,
}: {
  tags: FeedbackTagProps['Row'][];
  feedback: FeedbackWithUserProps;
  children: React.ReactNode;
  setFeedbackList: React.Dispatch<React.SetStateAction<FeedbackWithUserProps[]>>;
  feedbackList: FeedbackWithUserProps[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const projectSlug = pathname.split('/')[1];
  const [commentContent, setCommentContent] = useState<string>('');

  // Copy value to clipboard
  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);

    toast.success(`Copied ${key} to clipboard!`);
  };

  // Post comment
  async function onPostComment() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedback.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
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
      loading: 'Posting comment...',
      success: `Comment posted successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      // Reset comment content
      setCommentContent('');
    });
  }

  // Update status
  async function onUpdateStatus(status: string) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
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

    promise
      .then(() => {
        // Get index of feedback in feedbackList
        const index = feedbackList.findIndex((fb) => fb.id === feedback.id);

        // Update feedbackList
        const newFeedbackList = [...feedbackList];

        // Update feedback status
        newFeedbackList[index].status = status;

        // Update feedbackList state
        setFeedbackList(newFeedbackList);
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  // Update tag
  async function onUpdateTag(tag: string[]) {
    // Get tag object
    const tagObjArray = [] as FeedbackTagProps['Row'][];

    tag.forEach((tag) => {
      const tagObj = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());

      if (tagObj) {
        tagObjArray.push(tagObj);
      }
    });

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tagObjArray.map((tag) => tag.id),
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

    promise
      .then(() => {
        // Get index of feedback in feedbackList
        const index = feedbackList.findIndex((fb) => fb.id === feedback.id);

        // Update feedbackList
        const newFeedbackList = [...feedbackList];

        // Update feedback tags
        newFeedbackList[index].tags = tagObjArray;

        // Update feedbackList state
        setFeedbackList(newFeedbackList);
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  async function onDeleteFeedback() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback/${feedback.id}`, {
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
      loading: 'Deleting feedback...',
      success: () => {
        // Get index of feedback in feedbackList
        const index = feedbackList.findIndex((fb) => fb.id === feedback.id);

        // Update feedbackList
        const newFeedbackList = [...feedbackList];

        // Remove feedback from list
        newFeedbackList.splice(index, 1);

        // Update feedbackList state
        setFeedbackList(newFeedbackList);

        // Return success message
        return `Successfully deleted feedback!`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  return (
    // TODO: Optimize for mobile
    <ResponsiveDialog>
      <ResponsiveDialogTrigger className={className}>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:min-w-[425px]'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <div className='hover:bg-secondary fixed right-8 top-7 rounded-sm p-1 opacity-80 transition-all hover:cursor-pointer hover:opacity-100'>
              <MoreVertical className='h-4 w-4' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuItem
              className='flex flex-row items-center gap-2 font-extralight'
              onClick={() => {
                copyToClipboard('id', feedback.id);
              }}>
              {/* <Hash className='h-4 w-4' /> */}
              <Icons.Hashtag className='h-4 w-4 fill-white stroke-white stroke-[0.5px]' />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex flex-row items-center gap-2 font-extralight'
              onClick={() => {
                copyToClipboard('link', formatRootUrl(projectSlug, `/feedback/${feedback.id}`));
              }}>
              <Icons.Link className='h-4 w-4 stroke-white stroke-2' />
              Copy Link
            </DropdownMenuItem>

            {/* Mailto submitter */}
            <DropdownMenuItem
              className='flex flex-row items-center gap-2 font-extralight'
              onClick={() => {
                router.push(
                  `mailto:${feedback.user.email}?subject=Your Feedback Submission (${feedback.id})&body=Hi ${feedback.user.full_name},%0D%0A%0D%0AWe have received your recent feedback and had some follow up questions about it.%0D%0A%0D%0A${feedback.description}%0D%0A%0D%0AIf you could get back to us as soon as possible, that would be great!%0D%0A%0D%0AThanks!`
                );
              }}>
              <Icons.Profile className='h-4 w-4 fill-white' />
              Email submitter
            </DropdownMenuItem>

            <ResponsiveDialogClose className='w-full' hideCloseButton>
              <DropdownMenuItem
                className='flex flex-row items-center gap-2 font-extralight'
                onClick={onDeleteFeedback}>
                <Icons.Trash className='h-4 w-4 fill-white' />
                Delete
              </DropdownMenuItem>
            </ResponsiveDialogClose>
          </DropdownMenuContent>
        </DropdownMenu>

        <ResponsiveDialogHeader className='text-left'>
          <ResponsiveDialogTitle className='mr-5'>{feedback.title}</ResponsiveDialogTitle>
          {feedback.description ? (
            <ResponsiveDialogDescription>
              <div
                className={cn('text-foreground/60 text-sm font-light', PROSE_CN)}
                dangerouslySetInnerHTML={{ __html: feedback.description }}
              />
            </ResponsiveDialogDescription>
          ) : null}
        </ResponsiveDialogHeader>

        {/* Write Comment Text Area */}
        <div className='prose-invert flex w-full flex-col items-center justify-end rounded-sm border p-4'>
          {/* Editable Comment div with placeholder */}
          <CommentEditor
            content={commentContent}
            setContent={setCommentContent}
            placeholder='Write your comment here...'
            proseInvert
          />

          {/* Bottom Row */}
          <div className='flex w-full flex-row items-center justify-end'>
            {/* Submit Button */}
            <Button
              variant='outline'
              className='text-foreground/60 flex h-8 items-center justify-between gap-2 border font-extralight sm:w-fit'
              size='sm'
              onClick={onPostComment}>
              Post Comment
            </Button>
          </div>
        </div>

        <ResponsiveDialogFooter className='flex w-full flex-row items-center gap-2 sm:justify-start'>
          {/* Status */}
          <StatusCombobox
            initialValue={feedback.status}
            triggerClassName='bg-transparent h-fit w-fit py-1 px-3 hover:bg-secondary/80'
            showDropdownIcon={false}
            onSelect={onUpdateStatus}
            align='start'
          />

          {/* Tags */}
          <TagCombobox
            projectTags={tags.map((tag) => ({ value: tag.name, label: tag.name, color: tag.color }))}
            triggerClassName='bg-transparent w-fit h-fit py-1 px-3 hover:bg-secondary/80'
            showDropdownIcon={false}
            initialValue={feedback.tags ? feedback.tags.map((tag) => tag.name.toLowerCase()) : []}
            onSelect={onUpdateTag}
            align='start'
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
