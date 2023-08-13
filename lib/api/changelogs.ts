import { withProjectAuth } from '../auth';
import { ChangelogProps, ErrorProps } from '../types';
import { decode } from 'base64-arraybuffer';

// Create Changelog
export const createChangelog = (
  slug: string,
  data: {
    title: string;
    summary: string;
    content: string;
    image?: string;
    publish_date?: Date;
    published: boolean;
  },
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

    // If theres an image, upload it
    if (data.image) {
      // Create unique image path
      const imagePath = `${project!.slug}/${Math.random().toString(36).substring(7)}`;

      const { data: upload, error: uploadError } = await supabase.storage
        .from('changelog-images')
        // project.slug/randomstring
        .upload(imagePath, decode(data.image.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('changelog-images').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.image = publicUrlData.publicUrl;
    }

    // Create Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .insert({
        project_id: project!.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        image: data.image,
        publish_date: data.publish_date,
        published: data.published,
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
  data: {
    title: string;
    summary: string;
    content: string;
    image?: string;
    publish_date?: Date;
    published: boolean;
  },
  cType: 'server' | 'route'
) =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // If theres an image, which is a base64 string, upload it
    if (data.image && data.image.startsWith('data:image/')) {
      // Create unique image path
      const imagePath = `${project!.slug}/${Math.random().toString(36).substring(7)}`;

      const { data: upload, error: uploadError } = await supabase.storage
        .from('changelog-images')
        // project.slug/randomstring
        .upload(imagePath, decode(data.image.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('changelog-images').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.image = publicUrlData.publicUrl;
    }

    // Update Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .update({
        title: data.title,
        summary: data.summary,
        content: data.content,
        image: data.image,
        publish_date: data.publish_date,
        published: data.published,
      })
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
