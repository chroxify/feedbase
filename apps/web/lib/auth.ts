import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProjectProps, ErrorProps, ApiResponse } from '@/lib/types';
import { Database } from '@/lib/supabase';

// Create Supabase Client for needed client type
// Also returns the current user
// cType: 'server' | 'route'
async function createClient(cType: 'server' | 'route') {
  const cookieStore = cookies();
  const supabase =
    cType === 'server'
      ? await createServerComponentClient<Database>({ cookies: () => cookieStore })
      : await createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  return { supabase, user };
}
type WithProjectAuthHandler<T> = (
    user: UserMetadata | null,
    supabase: SupabaseClient<Database>,
    project: ProjectProps['Row'] | null,
    error: ErrorProps | null,
    allowPublic?: boolean
  ) => ApiResponse<T>;

// withProjectAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is a member of the project with the given slug
export const withProjectAuth = <T>(handler: WithProjectAuthHandler<T>) => {
  return async (slug: string, cType: 'server' | 'route', allowPublic = false) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null && !allowPublic) {
      return handler(user.data.user, supabase, null, {
        message: 'unauthorized, login required.',
        status: 401,
      });
    }

    // Get project from database
    const { data: project, error } = await supabase.from('projects').select().eq('slug', slug).single();

    // If error is not null, then the project does not exist
    if (error) {
      return handler(user.data.user, supabase, project, { message: 'project not found.', status: 404 });
    }

    // Check if user is a member of the project
    if (!allowPublic) {
      const { error: projectMemberError } = await supabase
        .from('project_members')
        .select()
        .eq('project_id', project.id)
        .eq('member_id', user.data.user!.id)
        .single();

      // If not null, user is not a member of the project and should not be able to access it
      if (projectMemberError) {
        return handler(user.data.user, supabase, project, { message: 'project not found.', status: 404 });
      }
    }

    return handler(user.data.user, supabase, project, null, allowPublic);
  };
};

type WithUserAuthHandler<T> = (user: UserMetadata | null, supabase: SupabaseClient<Database>, error: ErrorProps | null) => ApiResponse<T>;

// withUserAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in
export const withUserAuth = <T>(handler: WithUserAuthHandler<T>) => {
  return async (cType: 'server' | 'route') => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null) {
      return handler(user.data.user, supabase, { message: 'unauthorized, login required.', status: 401 });
    }

    return handler(user.data.user, supabase, null);
  };
};
