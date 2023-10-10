'use client';

import { Icons } from '@/components/shared/icons/icons-static';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserAuthForm({ authType }: { authType: 'sign-in' | 'sign-up' }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<'github' | 'email'>('github');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const supabase = createClientComponentClient();

  async function handleMailSignIn(event: React.SyntheticEvent) {
    setIsLoading(true);

    event.preventDefault();
    setProvider('email');

    if (!name && authType === 'sign-up') {
      toast.error('Please enter your name!');
      setIsLoading(false);
      return;
    } else if (!email) {
      toast.error('Please enter your email!');
      setIsLoading(false);
      return;
    }

    // Check if user exists
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();

    if (user && authType === 'sign-up') {
      toast.error('An account with this email address already exists.');
      setIsLoading(false);
      return;
    } else if (!user && authType === 'sign-in') {
      toast.error('No account found with this email address.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: name || user?.full_name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic link has been sent to your email!');
    }

    setIsLoading(false);
  }

  async function handleGitHubSignIn(event: React.SyntheticEvent) {
    setIsLoading(true);

    event.preventDefault();
    setProvider('github');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='grid gap-4'>
      <form onSubmit={handleMailSignIn}>
        <div className='grid gap-3'>
          <div className='gap- grid gap-2'>
            {authType === 'sign-up' && (
              <>
                <Label className='sr-only' htmlFor='email'>
                  Full Name
                </Label>
                <Input
                  id='name'
                  placeholder='Full Name'
                  type='name'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(event) => setName(event.currentTarget.value)}
                />
              </>
            )}

            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && provider === 'email' && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Continue with Email
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-root px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={isLoading} onClick={handleGitHubSignIn}>
        {isLoading && provider === 'github' ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.github className='mr-2 h-4 w-4' />
        )}{' '}
        Github
      </Button>
    </div>
  );
}
