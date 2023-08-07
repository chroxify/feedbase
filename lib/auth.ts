import { NextResponse } from 'next/server';
import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProjectProps } from './types';

async function getUser() {
  const supabase = await createRouteHandlerClient({ cookies });
  const user = await supabase.auth.getUser();
  return { supabase, user };
}

interface WithUserApiAuthHandler {
  (req: Request, user: UserMetadata, supabase: SupabaseClient): Promise<NextResponse | void>;
}

export const withUserAuth = (handler: WithUserApiAuthHandler) => {
  return async (req: Request) => {
    // Get the user from the session
    const { supabase, user } = await getUser();

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null) {
      return NextResponse.json({ error: 'unauthorized, login required.' }, { status: 401 });
    }

    return handler(req, user.data.user, supabase);
  };
};

interface WithProjectApiAuthHandler {
  (
    req: Request,
    user: UserMetadata,
    supabase: SupabaseClient,
    project: ProjectProps,
    context?: any
  ): Promise<NextResponse | Response>;
}

export const withProjectAuth = (handler: WithProjectApiAuthHandler) => {
  return async (req: Request, context: any) => {
    // Get the user from the session
    const { supabase, user } = await getUser();

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null) {
      return NextResponse.json({ error: 'unauthorized, login required.' }, { status: 401 });
    }

    // Get project from database
    const { data: project, error } = await supabase
      .from('projects')
      .select()
      .eq('slug', context.params.slug)
      .single();

    // If error is not null, then the project does not exist
    if (error) {
      return NextResponse.json({ error: 'project not found.' }, { status: 404 });
    }

    // Check if user is a member of the project
    const { error: projectMemberError } = await supabase
      .from('project_members')
      .select()
      .eq('project_id', project.id)
      .eq('member_id', user.data.user.id)
      .single();

    // If not null, user is not a member of the project and should not be able to access it
    if (projectMemberError) {
      return NextResponse.json({ error: 'project not found.' }, { status: 404 });
    }

    return handler(req, user.data.user, supabase, project);
  };
};
