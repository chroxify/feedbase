'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import useTeamInvites from '@/lib/swr/use-team-invites';
import useTeamMembers from '@/lib/swr/use-team-members';
import { formatTimeAgo } from '@/lib/utils';
import SettingsCard from '@/components/dashboard/settings/settings-card';
import FetchError from '@/components/shared/fetch-error';

export default function TeamSettings({ params }: { params: { slug: string } }) {
  const {
    teamMembers,
    error: memberError,
    mutate: mutateMember,
    isValidating: isValidatingMember,
  } = useTeamMembers();
  const {
    teamInvites,
    error: inviteError,
    mutate: inviteMutate,
    isValidating: inviteIsValidating,
  } = useTeamInvites();
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'admins' | 'members' | 'invites'>('all');

  // Filtered
  const filteredMembers = teamMembers?.filter(
    (member) =>
      member.full_name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredInvites = teamInvites?.filter((invite) =>
    invite.email.toLowerCase().includes(search.toLowerCase())
  );

  if (memberError || inviteError) {
    return memberError ? (
      <FetchError error={memberError} mutate={mutateMember} isValidating={isValidatingMember} />
    ) : (
      <FetchError error={inviteError} mutate={inviteMutate} isValidating={inviteIsValidating} />
    );
  }

  if (!filteredMembers && isValidatingMember && !filteredInvites && inviteIsValidating) {
    return (
      <>
        <SettingsCard title='Invite a Team Member' description='Invite a new team member to this project.'>
          <div className='col-span-1 -mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Email</Label>
            <div className='flex w-full gap-2'>
              <Input className='w-full' placeholder='member@feedbase.app' />
              <Button className='shrink-0'>Send Invite</Button>
            </div>
            <Label className='text-muted-foreground text-xs'>
              The user will receive an email with an invite link.
            </Label>
          </div>
        </SettingsCard>
        <SettingsCard title='Team Members' description='Manage the team members of this project.'>
          <div className='col-span-2 flex w-full flex-col items-start justify-start gap-5'>
            <div className='flex w-2/5 items-center gap-2'>
              <Input
                className='w-full'
                placeholder='Search members...'
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-fit font-normal'>
                    {filter === 'all'
                      ? 'All'
                      : filter === 'admins'
                      ? 'Admins'
                      : filter === 'members'
                      ? 'Members'
                      : 'Invites'}
                    <ChevronsUpDown className='text-secondary-foreground ml-2 h-3.5 w-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('all');
                    }}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('admins');
                    }}>
                    Admins
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('members');
                    }}>
                    Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('invites');
                    }}>
                    Pending Invites
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className='text-secondary-foreground inline-flex items-center gap-1 text-sm'>
              <Skeleton className='h-5 w-5' />
              {filter === 'all' && 'members'}
              {filter === 'admins' && 'admins'}
              {filter === 'members' && 'members'}
              {filter === 'invites' && 'pending invites'}
            </span>
          </div>

          <Skeleton className='col-span-2 h-72 w-full' />
        </SettingsCard>
      </>
    );
  }

  if (filteredMembers && filteredInvites) {
    return (
      <>
        <SettingsCard
          title='Invite a Team Member'
          description='Invite a new team member to this project.'
          className='gap-5'>
          <div className='col-span-1 -mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Email</Label>
            <div className='flex w-full gap-2'>
              <Input className='w-full' placeholder='member@feedbase.app' />
              <Button className='shrink-0'>Send Invite</Button>
            </div>
            <Label className='text-muted-foreground text-xs'>
              The user will receive an email with an invite link.
            </Label>
          </div>
        </SettingsCard>

        <SettingsCard title='Team Members' description='Manage the team members of this project.'>
          <div className='col-span-2 flex w-full flex-col items-start justify-start gap-5'>
            {/* Action Row */}
            <div className='flex w-2/5 items-center gap-2'>
              <Input
                className='w-full'
                placeholder='Search members...'
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-fit font-normal'>
                    {filter === 'all'
                      ? 'All'
                      : filter === 'admins'
                      ? 'Admins'
                      : filter === 'members'
                      ? 'Members'
                      : 'Invites'}
                    <ChevronsUpDown className='text-secondary-foreground ml-2 h-3.5 w-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('all');
                    }}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('admins');
                    }}>
                    Admins
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('members');
                    }}>
                    Members
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilter('invites');
                    }}>
                    Pending Invites
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Members */}
            <div className='flex w-full flex-col items-start justify-between'>
              <span className='text-secondary-foreground text-sm'>
                {filter === 'all' && filteredMembers.length + filteredInvites.length}
                {/* TODO: Implement different roles, currently all are handled the same. */}
                {filter === 'admins' && filteredMembers.length}
                {filter === 'members' && filteredMembers.length}
                {filter === 'invites' && filteredInvites.length}{' '}
                {filter === 'all' &&
                  (filteredMembers.length + filteredInvites.length > 1 ? 'members' : 'member')}
                {filter === 'admins' && (filteredMembers.length > 1 ? 'admins' : 'admin')}
                {filter === 'members' && (filteredMembers.length > 1 ? 'members' : 'member')}
                {filter === 'invites' && (filteredInvites.length > 1 ? 'pending invites' : 'pending invite')}
              </span>

              <div className='flex w-full flex-col'>
                {/* Team Members */}
                {(filter === 'all' || filter === 'admins' || filter === 'members') &&
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className='flex h-fit w-full items-center justify-between border-b py-3.5 last:border-b-0'>
                      <div className='flex w-full items-center gap-3'>
                        <Avatar className='h-[30px] w-[30px] rounded-full'>
                          <AvatarImage src={member.avatar_url || ''} alt={member.full_name} />
                          <AvatarFallback className='bg-secondary select-none text-sm'>
                            {member.full_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex w-full flex-col'>
                          <span className='text-foreground text-sm'>{member.full_name}</span>
                          <span className='text-muted-foreground text-xs'>{member.email}</span>
                        </div>
                      </div>

                      <div className='flex w-fit shrink-0 items-center justify-center gap-3'>
                        {/* Joined days ago */}
                        <span className='text-muted-foreground text-sm'>
                          Joined {formatTimeAgo(new Date(member.joined_at))} ago
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='text-muted-foreground h-6 w-6'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Make Admin</DropdownMenuItem>
                            <DropdownMenuDestructiveItem>Suspend</DropdownMenuDestructiveItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                {/* Pending Invites */}
                {(filter === 'all' || filter === 'invites') &&
                  filteredInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className='flex h-fit w-full items-center justify-between border-b py-3.5 last:border-b-0'>
                      <div className='flex w-full items-center gap-3'>
                        <Avatar className='h-[30px] w-[30px] rounded-full'>
                          <AvatarFallback className='bg-secondary select-none text-sm'>
                            {invite.email[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex w-full flex-col'>
                          <span className='text-foreground text-sm'>{invite.email}</span>
                          <span className='text-muted-foreground text-xs'>
                            Invited by {invite.creator.full_name}
                          </span>
                        </div>
                      </div>

                      <div className='flex w-fit shrink-0 items-center justify-center gap-3'>
                        <span className='text-muted-foreground text-sm'>
                          Invited {formatTimeAgo(new Date(invite.created_at))} ago
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='text-muted-foreground h-6 w-6'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Resend</DropdownMenuItem>
                            <DropdownMenuDestructiveItem>Revoke</DropdownMenuDestructiveItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                {/* Empty States */}
                {((filter === 'all' || filter === 'admins' || filter === 'members') &&
                  filteredMembers.length === 0) ||
                (filter === 'invites' && filteredInvites.length === 0) ||
                ((filter === 'all' || filter === 'admins' || filter === 'members') &&
                  filteredMembers.length === 0 &&
                  filteredInvites.length === 0) ? (
                  <div className='flex h-32 w-full items-center justify-center'>
                    <span className='text-muted-foreground text-sm'>
                      {filter === 'all' || filter === 'admins' || filter === 'members'
                        ? 'No members found.'
                        : 'No pending invites found.'}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </SettingsCard>
      </>
    );
  }
}
