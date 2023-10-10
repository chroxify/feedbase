'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import LottiePlayer from '../shared/lottie-player';
import { LogoutIcon, ProfileIcon } from '../shared/icons/icons-animated';
import { useState } from 'react';
import { UserMetadata } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UserDropdown({ user }: { user: UserMetadata }) {
  const [isHover, setIsHover] = useState<string>('');
  const supabase = createClientComponentClient();

  function handleLogout() {
    supabase.auth.signOut();

    // Redirect to login page
    window.location.href = '/login';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-9 w-9 border hover:cursor-pointer'>
          <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
          <AvatarFallback className='select-none text-sm font-light'>
            {user.user_metadata.full_name[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        {/* Profile */}
        <DropdownMenuItem
          className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
          onMouseEnter={() => setIsHover('Profile')}
          onMouseLeave={() => setIsHover('')}>
          <LottiePlayer lottieSrc={ProfileIcon} animate={isHover === 'Profile'} className='h-5 w-5' />

          <div className='pb-[2px] text-foreground/[85%]'>Profile</div>
        </DropdownMenuItem>

        {/* Logout */}
        <DropdownMenuItem
          className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
          onMouseEnter={() => setIsHover('Logout')}
          onMouseLeave={() => setIsHover('')}
          onClick={handleLogout}>
          <LottiePlayer lottieSrc={LogoutIcon} animate={isHover === 'Logout'} className='h-5 w-5' />

          <div className='pb-[2px] text-foreground/[85%]'>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
