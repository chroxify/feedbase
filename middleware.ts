import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const requestUrl = new URL(req.nextUrl);

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  // If route is /projects/*, check if user is logged in and a member of the project
  if (req.nextUrl.pathname.startsWith('/projects')) {
    // Get user
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return NextResponse.redirect(`${requestUrl.origin}/login`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      });
    }
    const slug = req.nextUrl.pathname.split('/')[2];

    if (!slug) {
      return res;
    }

    // Get project by slug
    const { data: project, error } = await supabase.from('projects').select().eq('slug', slug).single();

    // If project doesn't exist, redirect to /projects
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/projects`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      });
    }

    // Get project members
    const { data: projectMembers, error: projectMembersError } = await supabase
      .from('project_members')
      .select()
      .eq('project_id', project.id)
      .eq('member_id', user.data.user?.id);

    // If user is not a member of the project, redirect to /projects
    if (projectMembersError || projectMembers.length === 0) {
      return NextResponse.redirect(`${requestUrl.origin}/projects`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      });
    }

    // Return response with pathname header
    return NextResponse.next({
      headers: {
        'x-pathname': req.nextUrl.pathname,
        'x-project': slug,
      },
    });
  }

  return NextResponse.next();
}
