import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const resources = [
  {
    title: 'Cookie-based Auth and the Next.js App Router',
    subtitle:
      'This free course by Jon Meyers, shows you how to configure Supabase Auth to use cookies, and steps through some common patterns.',
    url: 'https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF',
    icon: 'M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21M4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20Z',
  },
  {
    title: 'Supabase Next.js App Router Example',
    subtitle:
      'Want to see a code example containing some common patterns with Next.js and Supabase? Check out this repo!',
    url: 'https://github.com/supabase/supabase/tree/master/examples/auth/nextjs',
    icon: 'M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8',
  },
  {
    title: 'Supabase Auth Helpers Docs',
    subtitle:
      'This template has configured Supabase Auth to use cookies for you, but the docs are a great place to learn more.',
    url: 'https://supabase.com/docs/guides/auth/auth-helpers/nextjs',
    icon: 'M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528',
  },
];

const examples = [
  { type: 'Client Components', src: 'app/_examples/client-component/page.tsx' },
  { type: 'Server Components', src: 'app/_examples/server-component/page.tsx' },
  { type: 'Server Actions', src: 'app/_examples/server-action/page.tsx' },
  { type: 'Route Handlers', src: 'app/_examples/route-handler.ts' },
];

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='flex w-full flex-col items-center'>
      <nav className='flex h-16 w-full justify-center border-b border-b-foreground/10'>
        <div className='flex w-full max-w-4xl items-center justify-between p-3 text-sm text-foreground'>
          <div />
          <div>
            {user ? (
              <div className='flex items-center gap-4'>Hey, {user.email}!</div>
            ) : (
              <Link
                href='/login'
                className='bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline'>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className='flex max-w-4xl flex-col gap-14 px-3 py-16 text-foreground opacity-0 animate-in lg:py-24'>
        <div className='mb-4 flex flex-col items-center lg:mb-12'>
          <div className='flex items-center justify-center gap-8'>
            <Link href='https://supabase.com/' target='_blank'></Link>
            <span className='h-6 rotate-45 border-l' />
          </div>
          <h1 className='sr-only'>Supabase and Next.js Starter Template</h1>
          <p className='mx-auto my-12 max-w-xl text-center text-3xl !leading-tight lg:text-4xl'>
            The fastest way to start building apps with <strong>Supabase</strong> and <strong>Next.js</strong>
          </p>
          <div className='rounded-lg bg-foreground px-6 py-3 font-mono text-sm text-background'>
            Get started by editing <strong>app/page.tsx</strong>
          </div>
        </div>

        <div className='w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]' />

        <div className='flex flex-col gap-8 text-foreground'>
          <h2 className='text-center text-lg font-bold'>Everything you need to get started</h2>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            {resources.map(({ title, subtitle, url, icon }) => (
              <a
                key={title}
                className='group relative flex flex-col rounded-lg border p-6 hover:border-foreground'
                href={url}
                target='_blank'
                rel='noreferrer'>
                <h3 className='mb-2 min-h-[40px]  font-bold lg:min-h-[60px]'>{title}</h3>
                <div className='flex grow flex-col justify-between gap-4'>
                  <p className='text-sm opacity-70'>{subtitle}</p>
                  <div className='flex items-center justify-between'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='opacity-80 group-hover:opacity-100'>
                      <path
                        d={icon}
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='ml-2 h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'>
                      <polyline points='9 18 15 12 9 6' />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-8 text-foreground'>
          <div className='mx-auto grid justify-center gap-2 text-center'>
            <h2 className='text-center text-lg font-bold'>Examples</h2>
            <p className='text-sm'>
              Look in the <code>_examples</code> folder to see how to create a Supabase client in all the
              different contexts.
            </p>
          </div>
          <div className='w-full justify-center overflow-hidden rounded-lg border'>
            {examples.map(({ type, src }) => (
              <div key={type} className='grid w-full grid-cols-3 border-b text-sm last:border-b-0'>
                <div className='min-h-12 flex w-full items-center p-4 font-bold'>{type}</div>
                <div className='col-span-2 flex items-center border-l p-4'>
                  <code className='whitespace-pre-wrap text-sm'>{src}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-center text-center text-xs'>
          <p>
            Powered by{' '}
            <Link href='https://supabase.com/' target='_blank' className='font-bold'>
              Supabase
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
