import { decode } from 'base64-arraybuffer';
import { withProjectAuth, withUserAuth } from '@/lib/auth';
import { ProjectConfigProps, ProjectProps, TeamMemberProps } from '@/lib/types';
import { isSlugValid } from '@/lib/utils';

// Get Project
export const getProjectBySlug = withProjectAuth<ProjectProps['Row']>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if project exists
    if (!project) {
      return { data: null, error: { message: 'project not found.', status: 404 } };
    }

    // Return project
    return { data: project, error: null };
  }
);

// Create Project
export const createProject = (data: ProjectProps['Insert'], cType: 'server' | 'route') =>
  withUserAuth<ProjectProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
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
      .insert({ member_id: user!.id, project_id: project[0].id })
      .select();

    // Check for errors
    if (projectMemberError) {
      return { data: null, error: { message: projectMemberError.message, status: 500 } };
    }

    // Create Project Config for Project
    const { error: projectConfigError } = await supabase
      .from('project_configs')
      .insert({ project_id: project[0].id })
      .select();

    // Check for errors
    if (projectConfigError) {
      return { data: null, error: { message: projectConfigError.message, status: 500 } };
    }

    // Return project
    return { data: project[0], error: null };
  })(cType);

// Update Project by slug
export const updateProjectBySlug = (slug: string, data: ProjectProps['Update'], cType: 'server' | 'route') =>
  withProjectAuth<ProjectProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if slug is valid
    if (data.slug && !isSlugValid(data.slug)) {
      return { data: null, error: { message: 'slug is invalid.', status: 400 } };
    }

    // If image is provided, upload to storage
    if (data.icon) {
      // Create unique image path
      const imagePath = `${project!.slug}/logo/${Date.now()}.png`;

      // Get current image path
      if (project!.icon) {
        const { data: currentImage } = supabase.storage.from('projects').getPublicUrl(project!.icon);

        // Get current image path (get last 3 segments of url)
        const currentImagePath = currentImage.publicUrl.split('/').slice(-3).join('/');

        // Delete current image
        const { error: deleteError } = await supabase.storage.from('projects').remove([currentImagePath]);

        // Check for errors
        if (deleteError) {
          return { data: null, error: { message: deleteError.message, status: 500 } };
        }
      }

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(imagePath, decode(data.icon.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public url for image
      const { data: publicUrlData } = supabase.storage.from('projects').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set icon to public URL
      data.icon = publicUrlData.publicUrl;
    }

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        name: data.name || project!.name,
        slug: data.slug || project!.slug,
        icon: data.icon || project!.icon,
        icon_radius: data.icon_radius || project!.icon_radius,
      })
      .eq('id', project!.id)
      .select();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated project
    return { data: updatedProject[0], error: null };
  })(slug, cType);

// Delete Project by slug
export const deleteProjectBySlug = withProjectAuth<ProjectProps['Row']>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete project
    const { data: deletedProject, error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project!.id)
      .select();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data: deletedProject[0], error: null };
  }
);

// Get all project members by slug
export const getProjectMembers = withProjectAuth<TeamMemberProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
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

    // Map members data and add joined_at field to each member
    const restructuredData = members.map((item) => {
      const profileData = item.profiles;
      return {
        ...profileData,
        joined_at: item.created_at,
      };
    }) as TeamMemberProps[];

    // Return members
    return { data: restructuredData, error: null };
  }
);

// Get project config by slug
export const getProjectConfigBySlug = withProjectAuth<ProjectConfigProps['Row']>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get project config
    const { data: config, error: configError } = await supabase
      .from('project_configs')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (configError) {
      return { data: null, error: { message: configError.message, status: 500 } };
    }

    // Return config
    return { data: config[0], error: null };
  }
);

// Update project config by slug
export const updateProjectConfigBySlug = (
  slug: string,
  data: ProjectConfigProps['Update'],
  cType: 'server' | 'route'
) =>
  withProjectAuth<ProjectConfigProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get project config
    const { data: config, error: configError } = await supabase
      .from('project_configs')
      .select()
      .eq('project_id', project!.id)
      .single();

    // Check for errors
    if (configError) {
      return { data: null, error: { message: configError.message, status: 500 } };
    }

    // Update project config
    const { data: updatedConfig, error: updateError } = await supabase
      .from('project_configs')
      .update({
        changelog_preview_style: data.changelog_preview_style || config.changelog_preview_style,
        changelog_twitter_handle:
          data.changelog_twitter_handle !== undefined
            ? data.changelog_twitter_handle
            : config.changelog_twitter_handle,
      })
      .eq('id', config.id)
      .select();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated config
    return { data: updatedConfig[0], error: null };
  })(slug, cType);
