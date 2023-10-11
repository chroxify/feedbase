import { UserMetadata } from '@supabase/supabase-js';
import { withUserAuth } from '../auth';
import { ProjectProps } from '../types';

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

// Get all projects for an user
export const getUserProjects = withUserAuth<ProjectProps['Row'][]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  // Get all projects for user
  const { data: projects, error: projectsError } = await supabase
    .from('project_members')
    .select('projects (*)')
    .eq('member_id', user!.id);

  // Check for errors
  if (projectsError) {
    return { data: null, error: { message: projectsError.message, status: 500 } };
  }

  // Restructure projects data
  const restructuredData = projects.map((item) =>
    'projects' in item ? item.projects : item
  ) as ProjectProps['Row'][];

  // Return projects
  return { data: restructuredData, error: null };
});
