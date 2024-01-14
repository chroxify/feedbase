import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { toast } from 'sonner';
import { Icons } from '@/components/shared/icons/icons-static';
import PostEditor from '@/components/shared/tiptap-editor';

export default function CreatePostModal({
  projectSlug,
  children,
}: {
  projectSlug: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Submit post
  function onSubmit() {
    // Set loading
    setIsLoading(true);

    // Create promise
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: content,
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
        // Close modal
        setOpen(false);

        // Set loading
        setIsLoading(false);

        // Reload comments
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-[425px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create a new post</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Have an idea or found a bug? Let us know!</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Project Name */}
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
              className='bg-secondary/30 font-light'
            />
          </div>
          {/* Project Slug */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='content'>Description</Label>
            </div>

            <div className='bg-secondary/30 focus-within:ring-ring ring-offset-root flex w-full flex-col items-center justify-end rounded-sm border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-1'>
              {/* Editable Comment div with placeholder */}
              <PostEditor content={content} setContent={setContent} className='min-h-[50px]' />
            </div>

            <Label className='text-foreground/50 text-xs font-extralight'>
              You can use Markdown to format your post.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <Button
            variant='default'
            type='submit'
            onClick={onSubmit}
            disabled={!title || content.replace(/<[^>]*>?/gm, '').length === 0 || isLoading}>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Submit Post
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
