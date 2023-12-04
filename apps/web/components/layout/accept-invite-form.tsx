'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { Button } from '@ui/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/components/ui/card';
import { ExtendedInviteProps, ProfileProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';

export default function ProjectInviteForm({
  invite,
  user,
}: {
  invite: ExtendedInviteProps;
  user: ProfileProps['Row'] | null;
}) {
  const router = useRouter();

  // Accept invitation
  function acceptInvitation() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${invite.project.slug}/invites/${invite.id}`, {
        method: 'POST',
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
      loading: 'Accepting invitation...',
      success: () => {
        router.push(`/${invite.project.slug}`);
        return `Invitation accepted! Redirecting...`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  // Expiration date = created_at + 7 days
  const expirationDate = new Date(invite.created_at);
  expirationDate.setDate(expirationDate.getDate() + 7);

  return (
    <Card className='w-full p-5 sm:max-w-md sm:p-6'>
      <CardHeader className='flex flex-col items-center space-y-2'>
        <Avatar className='border-border/80 h-14 w-14 rounded-md border'>
          <AvatarImage
            src={
              invite.project.icon !== '' || invite.project.icon !== null
                ? invite.project.icon
                : `${formatRootUrl()}/icon-512x512.png`
            }
            alt='Project Icon'
          />
          <AvatarFallback className='rounded-md'>
            {invite.project.name[0].toUpperCase() + invite.project.name[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className='pt-5 text-center text-lg'>
          You&apos;ve been invited to join {invite.project.name}
        </CardTitle>
        <CardDescription className='text-center'>
          {invite.creator.full_name} has invited you to join and collaborate on the project{' '}
          <strong className='text-foreground/70'>{invite.project.name}</strong> on Feedbase.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        {(!user || user.email !== invite.email) && (
          <span className='text-foreground/50 text-center text-sm font-light'>
            To accept this invitation, please login as{' '}
            <strong className='text-foreground/70 inline-flex'>{invite.email}</strong>.
          </span>
        )}

        {!invite.accepted &&
          expirationDate > new Date() &&
          (!user || user.email !== invite.email ? (
            <Link href='/login'>
              <Button className='w-full'> Sign In </Button>
            </Link>
          ) : (
            <Button className='w-full' onClick={acceptInvitation}>
              {' '}
              Accept Invitation{' '}
            </Button>
          ))}

        {/* Invalid invitation */}
        {invite.accepted || expirationDate < new Date() ? (
          <Button className='w-full' disabled>
            {' '}
            {invite.accepted ? 'Invitation accepted' : 'Invitation expired'}{' '}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
