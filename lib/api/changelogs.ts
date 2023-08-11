import { withProjectAuth } from '../auth';
import { ChangelogProps, ErrorProps } from '../types';

// Create Changelog
export const createChangelog = (
  slug: string,
  data: { title: string; content: string; published: boolean },
  cType: 'server' | 'route'
): Promise<{
  data: ChangelogProps | null;
  error: ErrorProps | null;
}> =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Create Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .insert({
        title: data.title,
        content: data.content,
        published: data.published,
        project_id: project!.id,
      })
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Return project
    return { data: changelog[0], error: null };
  })(slug, cType);

// Get All Project Changelogs
export const getAllProjectChangelogs = withProjectAuth(async (user, supabase, project, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error: error };
  }

  // Get Changelogs
  const { data: changelogs, error: changelogsError } = await supabase
    .from('changelogs')
    .select()
    .eq('project_id', project!.id);

  // Check for errors
  if (changelogsError) {
    return { data: null, error: { message: changelogsError.message, status: 500 } };
  }

  // Return changelogs
  return { data: changelogs, error: null };
});

// Get Changelog by ID
export const getChangelogByID = (id: string, slug: string, cType: 'server' | 'route') =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Get Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .select()
      .eq('id', id);

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Return changelog
    return { data: changelog[0], error: null };
  })(slug, cType);

// Update Changelog
export const updateChangelog = (
  id: string,
  slug: string,
  data: { title: string; content: string; published: boolean },
  cType: 'server' | 'route'
) =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Update Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .update({ title: data.title, content: data.content, published: data.published })
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!changelog || changelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: changelog[0], error: null };
  })(slug, cType);

// Delete Changelog
export const deleteChangelog = (id: string, slug: string, cType: 'server' | 'route') =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Delete Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .delete()
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!changelog || changelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: { success: true }, error: null };
  })(slug, cType);
