import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { UserAuthForm } from '@/components/user-auth-form';

export const metadata: Metadata = {
  title: 'Sign in to Luminar',
  description: 'Sign in to your Luminar account.',
};

export default async function SignIn() {
  // Create a Supabase client configured to use cookies
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Retrieve possible session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there is a session, redirect to projects
  if (user) {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full p-5 sm:max-w-md sm:p-6'>
        <CardHeader className='flex flex-col items-center space-y-2'>
          <CardTitle>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign in with your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className='px-2'>
          <UserAuthForm authType='sign-in' />
        </CardContent>
        <CardFooter className='flex flex-col items-center'>
          <CardDescription className='text-center'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='font-medium hover:underline'>
              Sign Up
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
