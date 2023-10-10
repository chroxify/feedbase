'use client';

import { MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/components/ui/tabs';
import { TeamMemberProps } from '@/lib/types';

export function TeamTable({ members }: { members: TeamMemberProps[] }) {
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

  return (
    <Tabs defaultValue='members' className='w-full'>
      <TabsList className='grid w-[200px] grid-cols-2'>
        <TabsTrigger value='members'>Members</TabsTrigger>
        <TabsTrigger value='invites'>Invites</TabsTrigger>
      </TabsList>
      <TabsContent value='members'>
        <div className='flex h-full w-full flex-col items-center rounded-md border p-3'>
          {members.map((member) => (
            <div className='flex w-full flex-row justify-between' key={member.id}>
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
        <div className='flex h-full w-full flex-col items-center rounded-md border p-3'>
          <span className='text-foreground/70 text-sm'>Section currently under development.</span>
        </div>
      </TabsContent>
    </Tabs>
  );
}
