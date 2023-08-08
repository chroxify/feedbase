'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState<'github' | 'email'>('github');
  const [email, setEmail] = React.useState<string>('');
  const supabase = createClientComponentClient();

  async function handleMailSignIn(event: React.SyntheticEvent) {
    setIsLoading(true);

    event.preventDefault();
    setProvider('email');

    if (!email) {
      toast.error('Please enter your email!');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
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

    const { data, error } = await supabase.auth.signInWithOAuth({
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
    <div className={cn('grid gap-4', className)} {...props}>
      <form onSubmit={handleMailSignIn}>
        <div className='grid gap-3'>
          <div className='gap- grid'>
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
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
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
