'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/components/ui/tabs';
import { ExtendedInviteProps, TeamMemberProps } from '@/lib/types';
import DefaultTooltip from '@/components/shared/tooltip';
import InviteMemberDialog from '../modals/add-member-modal';

export function TeamTable({
  members,
  invites,
  projectSlug,
}: {
  members: TeamMemberProps[];
  invites: ExtendedInviteProps[];
  projectSlug: string;
}) {
  const router = useRouter();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const year = new Date().getFullYear();
    const dateYear = date.getFullYear();

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    if (year === dateYear) {
      return `${month} ${day}`;
    }
    return `${month} ${day}, ${dateYear}`;
  }

  function calculateExpirationTime(dateString: string): number {
    // Expiration date is dateString + 7 days
    const expirationDate = new Date(dateString);
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Calculate time left until expiration
    const timeLeft = expirationDate.getTime() - new Date().getTime();

    // Convert time to days (make sure to always round up)
    const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

    return daysLeft;
  }

  // Revoke invite
  function revokeInvite(invite: ExtendedInviteProps) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/invites/${invite.id}`, {
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
      loading: 'Revoking invitation...',
      success: () => {
        router.refresh();
        return `Invitation revoked!`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  return (
    <Tabs defaultValue='members' className='w-full'>
      <div className='flex w-full flex-row items-center justify-between'>
        <TabsList className='grid w-[200px] grid-cols-2'>
          <TabsTrigger value='members'>Members</TabsTrigger>
          <TabsTrigger value='invites'>Invites</TabsTrigger>
        </TabsList>

        <InviteMemberDialog projectSlug={projectSlug}>
          <Button variant='default' className='font-norm flex items-center gap-1'>
            <Plus className='-ml-[2px] inline-flex h-[18px] w-[18px]' />
            Invite
          </Button>
        </InviteMemberDialog>
      </div>
      <TabsContent value='members'>
        <div className='flex h-full w-full flex-col items-center rounded-md border '>
          {members.map((member) => (
            <div
              className='flex w-full flex-row justify-between border-b p-3 last:border-none'
              key={member.id}>
              <div className='flex flex-row items-center space-x-2'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src={member.avatar_url ?? ''} alt={member.full_name} />
                  <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                </Avatar>

                {/* Name and Email */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>{member.full_name}</span>

                  <span className='text-foreground/50 text-xs font-light'>{member.email}</span>
                </div>
              </div>

              <div className='flex flex-row items-center space-x-2'>
                {/* Join Date */}
                {/* TODO: Add Role Badge */}
                <span className='text-foreground/50 hidden text-xs font-light md:block'>
                  {`Joined ${formatDate(member.joined_at)}`}
                </span>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='text-foreground/50 hover:text-foreground h-8 w-5'>
                      <MoreVertical className='h-5 w-5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=' justify-between' align='end'>
                    {/* TODO: Add logic for removing */}
                    <DropdownMenuItem className='text-destructive focus:text-destructive/90' disabled>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value='invites'>
        <div className='flex h-full w-full flex-col items-center rounded-md border'>
          {invites.map((invite) => (
            <div
              className='flex w-full flex-row justify-between border-b p-3 last:border-none'
              key={invite.id}>
              <div className='flex flex-row items-center space-x-2'>
                {/* Avatar */}
                <Avatar>
                  <AvatarFallback className='text-foreground/80 text-sm font-light'>
                    {invite.email[0].toUpperCase() + invite.email[1].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Name and Email */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>{invite.email}</span>

                  <span className='text-foreground/50 text-xs font-light'>
                    Invited by {invite.creator.full_name}
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center space-x-2'>
                {/* Status */}
                <DefaultTooltip
                  content={
                    calculateExpirationTime(invite.created_at) < 0
                      ? 'Invitation has expired.'
                      : `Invitation expires in ${calculateExpirationTime(invite.created_at)} days.`
                  }>
                  <span className='text-foreground/50 bg-background hidden rounded border px-2 py-1 text-xs font-light md:block'>
                    {invite.accepted
                      ? 'Accepted'
                      : calculateExpirationTime(invite.created_at) < 0
                      ? 'Expired'
                      : 'Pending'}
                  </span>
                </DefaultTooltip>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='text-foreground/50 hover:text-foreground h-8 w-5'>
                      <MoreVertical className='h-5 w-5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=' justify-between' align='end'>
                    <DropdownMenuItem
                      className='text-destructive focus:text-destructive/90 focus:bg-destructive/20'
                      onSelect={() => {
                        revokeInvite(invite);
                      }}
                      disabled={calculateExpirationTime(invite.created_at) < 0 || invite.accepted}>
                      Revoke Invite
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {invites.length === 0 && (
            <div className='flex h-full w-full flex-col items-center justify-center'>
              <div className='flex flex-col items-center justify-center p-5'>
                <span className='text-foreground/50 text-sm font-light'>No invites yet.</span>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
