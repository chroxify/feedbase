import LogoProvider from '@/components/logo-provider';
import { Background } from '@/components/ui/background/background';
import Link from 'next/link';

export default async function Landing() {
  return (
    <div className='flex h-screen w-full flex-col items-center bg-[#0A0C10]'>
      <div className='flex h-full w-full flex-col items-center lg:max-w-screen-xl'>
        {/* Header */}
        <div className='z-50 flex w-full flex-row items-center justify-between p-5'>
          <LogoProvider forceTheme='dark' className='w-36 pb-0' />
          <Link
            href='/login'
            className='inline-flex h-10 items-center justify-center rounded-md bg-[#7855FF] px-4 py-2 text-sm font-medium text-[#f8fafc] hover:bg-[#7855FF]/90 sm:text-base'>
            Login
          </Link>
        </div>

        {/* Main Content */}
        <div className='z-50 mb-28 flex h-full w-full flex-col items-center justify-center gap-10'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-center text-4xl font-bold text-[#f8fafc] sm:text-5xl md:text-6xl lg:text-7xl'>
              Supercharge Product
              <br />
              <span className='text-[#7855FF]'>Engagement</span> and{' '}
              <span className='text-[#7855FF]'>Insights</span>
            </h1>
            <p className='text-center text-[#f8fafc]/80 sm:text-lg md:text-xl lg:text-2xl'>
              Open-source tool for smooth feedback management,
              <br /> empowering your customer relationships.
            </p>
          </div>

          {/* Buttons */}
          <div className='flex flex-row items-center justify-center gap-4'>
            <Link
              href='/signup'
              className='inline-flex h-10 items-center justify-center rounded-md bg-[#7855FF] px-4 py-2 text-sm font-medium text-[#f8fafc] hover:bg-[#7855FF]/90 sm:text-base'>
              Get Started
            </Link>
            <Link
              href='/github'
              className='inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-[#f8fafc] hover:underline sm:text-base'>
              Star on Github
            </Link>
          </div>
        </div>
        <Background />
      </div>
    </div>
  );
}
