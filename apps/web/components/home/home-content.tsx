'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from 'ui/components/ui/badge';
import { Button } from 'ui/components/ui/button';
import { WaitlistModal } from '@/components/dashboard/modals/add-waitlist-modal';
import { Icons } from '@/components/shared/icons/icons-static';

export default function HomeContent() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* Header */}
      <div className='flex w-full flex-row items-center justify-between'>
        {/* Logo */}
        <Icons.LogoText className='w-24 fill-white' />

        {/* Buttons */}
        <WaitlistModal open={open} setOpen={setOpen}>
          <Button className='border-background hidden border sm:inline-flex'>Request access</Button>
        </WaitlistModal>
        <div className='flex flex-row gap-4 pt-2 sm:hidden'>
          <Link href='/github'>
            <Icons.Github className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
          </Link>

          <Link href='/twitter'>
            <Icons.Twitter className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className='flex h-full w-full flex-col justify-center'>
        {/* Title */}
        <div className='max-w-3xl sm:shrink-0'>
          {/* Badge */}
          <Badge className='w-fit select-none bg-rose-400/10 font-light text-rose-400 hover:cursor-default hover:bg-rose-400/20'>
            Currently in private beta
          </Badge>

          {/* Title */}
          <h1 className='md:tex-6xl mt-2 bg-gradient-to-br from-white to-white/30 bg-clip-text py-1 text-4xl font-bold text-transparent sm:text-5xl'>
            Supercharge Product Engagement and Insights
          </h1>

          {/* Description */}
          <p className='mb-8 mt-4 text-base font-extralight text-white/60 sm:text-lg'>
            Create changelogs, roadmaps, and collect feedback with ease. Feedbase provides the best user and
            team experience, allowing you to focus on building your product.
          </p>

          {/* Access Button Desktop */}
          <WaitlistModal keyListener open={open} setOpen={setOpen}>
            <button
              className='group hidden select-none items-center gap-2 text-sm font-normal text-white/60 outline-none transition duration-200 ease-in-out hover:text-white sm:inline-flex'
              type='button'>
              Press
              <kbd className='inline-flex h-6 w-6 select-none items-center justify-center rounded border border-white/20 bg-[#18191E] text-xs uppercase text-white/60 transition duration-200 ease-in-out group-hover:bg-white/10 group-hover:text-white'>
                L
              </kbd>
              to request access
            </button>
          </WaitlistModal>

          {/* Access Button Mobile */}
          <WaitlistModal open={open} setOpen={setOpen}>
            <Button className='border-background border sm:hidden'>Request access</Button>
          </WaitlistModal>
        </div>
      </div>

      {/* Footer */}
      <div className='hidden w-full flex-col items-start justify-start gap-2 pt-2 sm:flex sm:pb-5'>
        {/* Socials */}
        <div className='flex flex-row gap-4'>
          <Link href='/github'>
            <Icons.Github className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
          </Link>

          <Link href='/twitter'>
            <Icons.Twitter className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
          </Link>
        </div>
      </div>
    </>
  );
}
