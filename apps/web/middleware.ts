import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError } from '@supabase/supabase-js';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /auth/callback (Supabase Auth callback)
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

  // custom domain / only for everything else routes
  if (hostname.split('.').slice(-1)[0] !== process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // Retrieve the project from the database
    const { data, error } = (await supabase
      .from('project_configs')
      .select('project:project_id (slug)')
      .eq('custom_domain', hostname)
      .eq('custom_domain_verified', true)
      .single()) as { data: { project: { slug: string } } | null; error: PostgrestError | null };

    // If the project doesn't exist, return 404
    if (error || !data) {
      return NextResponse.next();
    }

    // If the project exists, rewrite the request to the project's folder
    return NextResponse.rewrite(new URL(`/${data?.project?.slug}${path}`, req.url), {
      headers: {
        'x-pathname': path,
        'x-project': data?.project?.slug,
        'x-powered-by': 'Luminar',
      },
    });
  }

  // rewrites for app pages
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // protect all app pages with authentication except for /login, /signup and /invite/*
    if (!session.data.session && path !== '/login' && path !== '/signup' && !path.startsWith('/invite/')) {
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
      'x-powered-by': 'Luminar',
    },
  });
}
