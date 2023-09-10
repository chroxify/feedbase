'use client';

import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WaitlistModal } from '@/components/modals/add-waitlist-modal';
import { Background } from '@/components/ui/background/background';
import { useState } from 'react';

export default function Landing() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Background>
      <div className={'flex h-screen w-full flex-col items-center selection:bg-cyan-400/10'}>
        <div className='flex h-full w-full flex-col items-center p-5 sm:p-10 lg:max-w-screen-xl'>
          {/* Header */}
          <div className='flex w-full flex-row items-center justify-between'>
            {/* Logo */}
            <Icons.logoText className='w-24 text-white' />

            {/* Buttons */}
            <WaitlistModal open={open} setOpen={setOpen}>
              <Button className='hidden border border-background sm:inline-flex'>Request access</Button>
            </WaitlistModal>
            <div className='flex flex-row gap-4 pt-2 sm:hidden'>
              <Link href='/github'>
                <Icons.github className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
              </Link>

              <Link href='/twitter'>
                <Icons.twitter className='h-[22px] w-[22px] text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className='flex h-full w-full flex-col justify-center'>
            {/* Title */}
            <div className='max-w-3xl sm:shrink-0'>
              {/* Badge */}
              <Badge className='w-fit select-none bg-cyan-400/20 font-light text-cyan-400 hover:cursor-default hover:bg-cyan-400/20'>
                Coming Soon
              </Badge>

              {/* Title */}
              <h1 className='md:tex-6xl mt-2 bg-gradient-to-br from-white to-white/30 bg-clip-text py-1 text-4xl font-bold text-transparent sm:text-5xl'>
                Supercharge Product Engagement and Insights
              </h1>

              {/* Description */}
              <p className='mb-8 mt-4 text-base font-extralight text-white/50 sm:text-lg'>
                Create changelogs, roadmaps, and collect feedback with ease. Luminar provides the best user
                and team experience, allowing you to focus on building your product.
              </p>

              {/* Access Button Desktop */}
              <WaitlistModal keyListener open={open} setOpen={setOpen}>
                <button className='group hidden select-none items-center gap-2 text-sm font-normal text-white/50 outline-none transition duration-200 ease-in-out hover:text-white sm:inline-flex'>
                  Press
                  <kbd className='inline-flex h-6 w-6 select-none items-center justify-center rounded border border-white/20 bg-[#18191E] text-xs uppercase text-white/50 transition duration-200 ease-in-out group-hover:bg-white/10 group-hover:text-white'>
                    L
                  </kbd>
                  to request access
                </button>
              </WaitlistModal>

              {/* Access Button Mobile */}
              <WaitlistModal open={open} setOpen={setOpen}>
                <Button className='border border-background sm:hidden'>Request access</Button>
              </WaitlistModal>
            </div>
          </div>

          {/* Footer */}
          <div className='flex w-full flex-col items-start justify-start gap-2 pb-5 sm:pb-0'>
            {/* Socials */}
            <div className='hidden flex-row gap-4 pt-2 sm:flex'>
              <Link href='/github'>
                <Icons.github className='h-5 w-5 text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
              </Link>

              <Link href='/twitter'>
                <Icons.twitter className='h-5 w-5 text-white/60 transition duration-200 ease-in-out hover:text-white/90' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
