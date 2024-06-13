import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { actionFetcher, signInAnonymously } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';
import PostEditor from '@/components/shared/tiptap-editor';

export default function CreatePostModal({ children }: { children: React.ReactNode }) {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const { mutate } = useSWRConfig();

  // Create post
  const { trigger: createPost, isMutating } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback`,
    actionFetcher,
    {
      onSuccess: () => {
        // Mutate feedback
        mutate(`/api/v1/${slug}/feedback`);

        // Close modal
        setOpen(false);
      },
      onError: (err) => {
        toast.error(err);
      },
    }
  );

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-[425px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create a new post</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Have an idea or found a bug? Let us know!</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Workspace Name */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='title'>Title</Label>
            </div>

            <Input
              id='name'
              placeholder='Your post title'
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              className='bg-secondary/30 '
            />
          </div>
          {/* Workspace Slug */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='content'>Description</Label>
            </div>

            <div className='bg-secondary/30 focus-within:ring-ring ring-offset-root flex w-full flex-col items-center justify-end rounded-sm border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-1'>
              {/* Editable Comment div with placeholder */}
              <PostEditor content={content} setContent={setContent} className='min-h-[50px]' />
            </div>

            <Label className='text-foreground/50 text-xs font-light'>
              You can use Markdown to format your post.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <Button
            variant='default'
            type='submit'
            onClick={() => {
              // Sign in anonymously
              signInAnonymously();

              // Create post
              createPost({ title, content });
            }}
            disabled={!title || content.replace(/<[^>]*>?/gm, '').length === 0 || isMutating}>
            {isMutating ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Submit Post
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
