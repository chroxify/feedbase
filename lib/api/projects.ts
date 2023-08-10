import { withProjectAuth, withUserAuth } from '@/lib/auth';
import { isSlugValid } from '@/lib/utils';
import { ErrorProps, ProjectProps } from '../types';

// Get Project
export const getProjectBySlug = withProjectAuth(async (user, supabase, project, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  // Return project
  return { data: project, error: null };
});

// Create Project
export const createProject = (
  data: { name: string; slug: string },
  cType: 'server' | 'route'
): Promise<{
  data: ProjectProps | null;
  error: ErrorProps | null;
}> =>
  withUserAuth(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Check if slug is valid
    if (!isSlugValid(data.slug)) {
      return { data: null, error: { message: 'slug is invalid.', status: 400 } };
    }

    // Create Project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ name: data.name, slug: data.slug })
      .select();

    // Check for errors
    if (projectError) {
      return { data: null, error: { message: projectError.message, status: 500 } };
    }

    // Create Project Member for Project
    const { error: projectMemberError } = await supabase
      .from('project_members')
      .insert({ member_id: user!.id, project_id: project![0].id })
      .select();

    // Check for errors
    if (projectMemberError) {
      return { data: null, error: { message: projectMemberError.message, status: 500 } };
    }

    // Return project
    return { data: project[0], error: null };
  })(cType);

// Update Project by slug
export const updateProjectBySlug = (
  slug: string,
  data: { name: string; slug: string },
  cType: 'server' | 'route'
): Promise<{
  data: ProjectProps | null;
  error: ErrorProps | null;
}> =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ name: data.name, slug: data.slug })
      .eq('id', project!.id)
      .select();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated project
    return { data: updatedProject![0], error: null };
  })(slug, cType);

// Delete Project by slug
export const deleteProjectBySlug = withProjectAuth(async (user, supabase, project, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  // Delete project
  const { error: deleteError } = await supabase.from('projects').delete().eq('id', project!.id);

  // Check for errors
  if (deleteError) {
    return { data: null, error: { message: deleteError.message, status: 500 } };
  }

  // Return success
  return { data: { success: true }, error: null };
});

// Get all user projects
export const getUserProjects = withUserAuth(async (user, supabase, error) => {
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
  const restructuredData = projects.map((item) => ('projects' in item ? item.projects : item));

  // Return projects
  return { data: restructuredData, error: null };
});

// Get all project members by slug
export const getProjectMembers = withProjectAuth(async (user, supabase, project, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  // Get all members for project
  const { data: members, error: membersError } = await supabase
    .from('project_members')
    .select('profiles (*), created_at')
    .eq('project_id', project!.id);

  // Check for errors
  if (membersError) {
    return { data: null, error: { message: membersError.message, status: 500 } };
  }

  // Restructure members data and merge created_at field
  const restructuredData = members.map((item) => {
    return {
      ...item.profiles,
      created_at: item.created_at,
    };
  });

  // Return members
  return { data: restructuredData, error: null };
});
