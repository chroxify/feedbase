import { cookies } from 'next/headers';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import { ApiResponse, ErrorProps, FeedbackProps, ProjectProps } from '@/lib/types';

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
// allowAnonAccess = true bypasses complete user auth and project auth checks
// requireLogin = true requires the user to be logged in, even if allowAnonAccess is true
export const withProjectAuth = <T>(handler: WithProjectAuthHandler<T>) => {
  return async (slug: string, cType: 'server' | 'route', allowAnonAccess = false, requireLogin = true) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null && requireLogin) {
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
    if (!allowAnonAccess) {
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

    return handler(user.data.user, supabase, project, null, allowAnonAccess);
  };
};

type WithFeedbackAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  feedback: FeedbackProps['Row'] | null,
  project: ProjectProps['Row'] | null,
  error: ErrorProps | null
) => ApiResponse<T>;

// withFeedbackAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is authorized to access the feedback post with the given id
export const withFeedbackAuth = <T>(handler: WithFeedbackAuthHandler<T>) => {
  return async (id: string, slug: string, cType: 'server' | 'route', requireLogin = true) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null && requireLogin) {
      return handler(user.data.user, supabase, null, null, {
        message: 'unauthorized, login required.',
        status: 401,
      });
    }

    // Get project from database
    const { data: project, error } = await supabase.from('projects').select().eq('slug', slug).single();

    // If error is not null, then the project does not exist
    if (error) {
      return handler(user.data.user, supabase, null, project, { message: 'project not found.', status: 404 });
    }

    // Check if feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:user_id (*)')
      .eq('id', id)
      .eq('project_id', project.id)
      .single();

    // If not null, feedback does not exist
    if (feedbackError) {
      return handler(user.data.user, supabase, null, project, {
        message: 'feedback not found.',
        status: 404,
      });
    }

    // Return feedback
    return handler(user.data.user, supabase, feedback, project, null);
  };
};

type WithUserAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  error: ErrorProps | null
) => ApiResponse<T>;

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
