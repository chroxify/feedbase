import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { UserAuthForm } from '@/components/user-auth-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up to Luminar',
  description: 'Sign up for a new Luminar account.',
};

export default async function SignUp() {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient({ cookies });

  // Retrieve possible session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there is a session, redirect to the dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md p-8'>
        <CardHeader className='flex flex-col items-center space-y-2'>
          <CardTitle>Sign up</CardTitle>
          <CardDescription className='text-center'>
            Sign up with your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
        <CardFooter className='flex flex-col items-center'>
          <CardDescription className='text-center'>
            Already have an account?{' '}
            <Link href='/login' className='font-semibold hover:underline'>
              Sign In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
