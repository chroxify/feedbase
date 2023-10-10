import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { UserAuthForm } from '@/components/user-auth-form';

export const metadata: Metadata = {
  title: 'Sign up to Luminar',
  description: 'Sign up for a new Luminar account.',
};

export default async function SignUp() {
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
      <Card className='w-full max-w-md p-5 sm:p-8'>
        <CardHeader className='flex flex-col items-center space-y-2'>
          <CardTitle>Sign up</CardTitle>
          <CardDescription className='text-center'>
            Sign up with your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm authType='sign-up' />
        </CardContent>
        <CardFooter className='flex flex-col items-center'>
          <CardDescription className='text-center'>
            Already have an account?{' '}
            <Link href='/login' className='font-medium hover:underline'>
              Sign In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
