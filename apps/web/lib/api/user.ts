import { UserMetadata } from '@supabase/supabase-js';
import { withUserAuth } from '../auth';

// Get current user
export const getCurrentUser = withUserAuth<UserMetadata | null>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Return projects
  return { data: user, error: null };
});
