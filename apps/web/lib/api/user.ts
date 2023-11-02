import { decode } from 'base64-arraybuffer';
import { withUserAuth } from '../auth';
import { ProfileProps, ProjectProps } from '../types';

// Get current user
export const getCurrentUser = withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  // Check for errors
  if (profileError) {
    return { data: null, error: { message: profileError.message, status: 500 } };
  }

  // Return projects
  return { data: profile, error: null };
});

// Get all projects for an user
export const getUserProjects = withUserAuth<ProjectProps['Row'][]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
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

// Update user profile
export const updateUserProfile = (
  cType: 'route' | 'server',
  data: { full_name: string | undefined; avatar_url: string | undefined }
) =>
  withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    if (!user) {
      return { data: null, error: { message: 'user not found.', status: 404 } };
    }

    // If avatar url provided, upload to supabase storage
    if (data.avatar_url) {
      // Check if avatar already exists
      const { data: avatarData } = await supabase.storage.from('avatars').getPublicUrl(`${user.id}`);

      // Check for errors
      if (avatarData) {
        // Delete avatar
        await supabase.storage.from('avatars').remove([`${user.id}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}`, decode(data.avatar_url.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public url for avatar
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(`${user.id}`);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading avatar.', status: 500 } };
      }

      // Set avatar url to public url
      data.avatar_url = publicUrlData.publicUrl;
    }

    // Update user profile
    const { data: updatedUser, error: updatedUserError } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      })
      .eq('id', user.id)
      .select()
      .single();

    // Check for errors
    if (updatedUserError) {
      return { data: null, error: { message: updatedUserError.message, status: 500 } };
    }

    // Return updated user
    return { data: updatedUser, error: null };
  })(cType);
