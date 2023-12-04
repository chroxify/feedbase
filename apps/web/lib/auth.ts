import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies, headers } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import { ApiResponse, ErrorProps, FeedbackProps, ProfileProps, ProjectProps } from '@/lib/types';

export interface ClientCookiesConfig {
  cookies: {
    get?: (name: string) => string | undefined;
    set?: (name: string, value: string, options: CookieOptions) => void;
    remove?: (name: string, options: CookieOptions) => void;
  };
}

// Helper function to create a config object for the Supabase client
function createCookiesConfig(
  cookieStore: ReadonlyRequestCookies,
  operations: ('get' | 'set' | 'remove')[]
): ClientCookiesConfig {
  const config: ClientCookiesConfig = {
    cookies: {},
  };

  operations.forEach((operation) => {
    switch (operation) {
      case 'get':
        config.cookies.get = (name: string) => cookieStore.get(name)?.value;
        break;
      case 'set':
        config.cookies.set = (name: string, value: string, options: CookieOptions) =>
          cookieStore.set({ name, value, ...options });
        break;
      case 'remove':
        config.cookies.remove = (name: string, options: CookieOptions) =>
          cookieStore.set({ name, value: '', ...options });
        break;
      default:
        throw new Error(`Invalid operation: ${operation as string}`);
    }
  });

  return config;
}

// Create Supabase Client for needed client type
// Also returns the current user
// cType: 'server' | 'route'
async function createClient(cType: 'server' | 'route', isPublic = false) {
  const headerStore = headers();
  const cookieStore = cookies();
  const authHeader = headerStore.get('authorization');

  // Create client
  const supabase =
    cType === 'server'
      ? createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          createCookiesConfig(cookieStore, ['get'])
        )
      : createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            ...createCookiesConfig(cookieStore, ['get', 'set', 'remove']),
            global: {
              headers: {
                lumkey: authHeader ? authHeader.split(' ')[1] : '',
              },
            },
          }
        );

  // If auth header exists, validate api key
  if (authHeader) {
    // Get api key from auth header
    const apiKey = authHeader.split(' ')[1];

    // Fetch api key
    const { data, error } = (await supabase
      .from('project_api_keys')
      .select('project_id, permission, creator:creator_id (*)')
      .eq('token', apiKey)
      .single()) as unknown as {
      data: { permission: 'full_access' | 'public_access'; creator: ProfileProps['Row']; project_id: string };
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

    return { supabase, user: { data: { user: data.creator }, error: null }, apiKey: data };
  }

  const user = await supabase.auth.getUser();

  return { supabase, user, apiKey: null };
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
    const { supabase, user, apiKey } = await createClient(cType, allowAnonAccess);

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

    // If api key exists, check if the api key has access to the project
    if (apiKey && apiKey.project_id !== project.id) {
      return handler(user.data.user, supabase, project, {
        message: 'unauthorized, invalid api key.',
        status: 401,
      });
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
