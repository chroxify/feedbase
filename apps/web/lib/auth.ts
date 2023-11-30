import { cookies, headers } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import { ApiResponse, ErrorProps, FeedbackProps, ProfileProps, ProjectProps } from '@/lib/types';

// Create Supabase Client for needed client type
// Also returns the current user
// cType: 'server' | 'route'
async function createClient(cType: 'server' | 'route', isPublic = false) {
  const headerStore = headers();
  const cookieStore = cookies();

  // Create client switch
  const supabase =
    cType === 'server'
      ? createServerClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value;
              },
            },
            global: {
              headers: {
                apikey: headerStore.get('authorization')?.split(' ')[1] || '',
              },
            },
          }
        )
      : createServerClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value;
              },
              set(name: string, value: string, options: CookieOptions) {
                cookieStore.set(name, value, options);
              },
              remove(name: string) {
                cookieStore.delete(name);
              },
            },
            global: {
              headers: {
                apikey: headerStore.get('authorization')?.split(' ')[1] || '',
              },
            },
          }
        );

  // Check if request includes authorization header
  const authHeader = headerStore.get('authorization');

  // If auth header exists, validate api key
  if (authHeader) {
    // Get api key from auth header
    const apiKey = authHeader.split(' ')[1];

    // Fetch api key
    const { data, error } = (await supabase
      .from('project_api_keys')
      .select('permission, creator:creator_id (*)')
      .eq('token', apiKey)
      .single()) as unknown as {
      data: { permission: 'full_access' | 'public_access'; creator: ProfileProps['Row'] };
      error: ErrorProps;
    };

    // If error is not null, then the api key is invalid
    if (error) {
      return {
        supabase,
        user: { data: null, error: { message: 'unauthorized, invalid api key.', status: 401 } },
      };
    }

    // TODO: Expand this further, also supporting public access for feedback etc.
    if (data.permission === 'public_access' && !isPublic) {
      return {
        supabase,
        user: { data: null, error: { message: 'unauthorized, missing permissions.', status: 403 } },
      };
    }

    return { supabase, user: { data: { user: data.creator }, error: null } };
  }

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
    const { supabase, user } = await createClient(cType, (allowAnonAccess && !requireLogin) || false);

    // If user.error is not null, then the user is likely not logged in
    if ((user.error !== null && requireLogin) || user.data === null) {
      return handler(null, supabase, null, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
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
    if ((user.error !== null && requireLogin) || user.data === null) {
      return handler(null, supabase, null, null, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
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
      return handler(null, supabase, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
      });
    }

    return handler(user.data.user, supabase, null);
  };
};
