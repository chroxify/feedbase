'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserMetadata } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { LogoutIcon, ProfileIcon } from './icons/icons-animated';
import LottiePlayer from './lottie-player';

export default function UserDropdown({
  user,
  rediretOnLogout,
}: {
  user: UserMetadata;
  rediretOnLogout?: string;
}) {
  const [isHover, setIsHover] = useState<string>('');
  const supabase = createClientComponentClient();

  function handleLogout() {
    supabase.auth.signOut();

    // Redirect to login page
    window.location.href = rediretOnLogout || location.origin;
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
          onMouseEnter={() => {
            setIsHover('Profile');
          }}
          onMouseLeave={() => {
            setIsHover('');
          }}>
          <LottiePlayer lottieSrc={ProfileIcon} animate={isHover === 'Profile'} className='h-5 w-5' />

          <div className='text-foreground/[85%] pb-[2px]'>Profile</div>
        </DropdownMenuItem>

        {/* Logout */}
        <DropdownMenuItem
          className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
          onMouseEnter={() => {
            setIsHover('Logout');
          }}
          onMouseLeave={() => {
            setIsHover('');
          }}
          onClick={handleLogout}>
          <LottiePlayer lottieSrc={LogoutIcon} animate={isHover === 'Logout'} className='h-5 w-5' />

          <div className='text-foreground/[85%] pb-[2px]'>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
