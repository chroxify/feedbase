'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { toast } from 'sonner';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { ProjectProps } from '@/lib/types';

export default function UnsubscribeChangelogCard({
  project,
  subId,
}: {
  project: ProjectProps['Row'];
  subId: string;
}) {
  const router = useRouter();

  // on click unsubscribe
  async function unsubscribe() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/${project.slug}/changelogs/subscribers`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subId,
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
      loading: 'Unsubscribing...',
      success: () => {
        router.push(`/`);
        return `Unsubscribed! Redirecting...`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  return (
    <Card className='flex w-full flex-col gap-4 p-6 sm:max-w-md sm:p-8'>
      <CardHeader className='p-0'>
        <CardTitle>Unsubscribe from {project.name} Changelogs</CardTitle>
        <CardDescription>
          You will no longer receive changelog updates from {project.name}. You can resubscribe at any time.
        </CardDescription>
      </CardHeader>
      <CardFooter className='p-0'>
        <Button onClick={unsubscribe}>Unsubscribe</Button>
      </CardFooter>
    </Card>
  );
}
