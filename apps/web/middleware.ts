import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|auth/callback|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const session = await supabase.auth.getSession();

  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // rewrites for app pages
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // protect all app pages with authentication except for /login and /signup
    if (!session.data.session && path !== '/login' && path !== '/signup') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // rewrite / to /app
    return NextResponse.rewrite(new URL(`/app${path === '/' ? '' : path}`, req.url), {
      headers: {
        'x-pathname': path,
        'x-project': path.split('/')[1],
      },
    });
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, req.url), {
      headers: {
        'x-pathname': path,
        'x-project': path.split('/')[1],
      },
    });
  }

  // rewrite everything else to `/[sub-domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname.split('.')[0]}${path}`, req.url), {
    headers: {
      'x-pathname': path,
      'x-project': hostname.split('.')[0],
    },
  });
}
