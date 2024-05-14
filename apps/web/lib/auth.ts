import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies, headers } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import { ApiResponse, ErrorProps, FeedbackProps, ProfileProps, WorkspaceProps } from '@/lib/types';

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
      .select('workspace_id, permission, creator:creator_id (*)')
      .eq('token', apiKey)
      .single()) as unknown as {
      data: {
        permission: 'full_access' | 'public_access';
        creator: ProfileProps['Row'];
        workspace_id: string;
      };
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

type WithWorkspaceAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  workspace: WorkspaceProps['Row'] | null,
  error: ErrorProps | null,
  allowPublic?: boolean
) => ApiResponse<T>;

// withWorkspaceAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is a member of the workspace with the given slug
// allowAnonAccess = true bypasses complete user auth and workspace auth checks
// requireLogin = true requires the user to be logged in, even if allowAnonAccess is true
export const withWorkspaceAuth = <T>(handler: WithWorkspaceAuthHandler<T>) => {
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

    // Get workspace from database
    const { data: workspace, error } = await supabase.from('workspaces').select().eq('slug', slug).single();

    // If error is not null, then the workspace does not exist
    if (error) {
      return handler(user.data.user, supabase, workspace, { message: 'workspace not found.', status: 404 });
    }

    // If api key exists, check if the api key has access to the workspace
    if (apiKey && apiKey.workspace_id !== workspace.id) {
      return handler(user.data.user, supabase, workspace, {
        message: 'unauthorized, invalid api key.',
        status: 401,
      });
    }

    // Check if user is a member of the workspace
    if (!allowAnonAccess) {
      const { error: projectMemberError } = await supabase
        .from('project_members')
        .select()
        .eq('workspace_id', workspace.id)
        .eq('member_id', user.data.user!.id)
        .single();

      // If not null, user is not a member of the workspace and should not be able to access it
      if (projectMemberError) {
        return handler(user.data.user, supabase, workspace, { message: 'workspace not found.', status: 404 });
      }
    }

    return handler(user.data.user, supabase, workspace, null, allowAnonAccess);
  };
};

type WithFeedbackAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  feedback: FeedbackProps['Row'] | null,
  workspace: WorkspaceProps['Row'] | null,
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

    // Get workspace from database
    const { data: workspace, error } = await supabase.from('workspaces').select().eq('slug', slug).single();

    // If error is not null, then the workspace does not exist
    if (error) {
      return handler(user.data.user, supabase, null, workspace, {
        message: 'workspace not found.',
        status: 404,
      });
    }

    // Check if feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:user_id (*)')
      .eq('id', id)
      .eq('workspace_id', workspace.id)
      .single();

    // If not null, feedback does not exist
    if (feedbackError) {
      return handler(user.data.user, supabase, null, workspace, {
        message: 'feedback not found.',
        status: 404,
      });
    }

    // Return feedback
    return handler(user.data.user, supabase, feedback, workspace, null);
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
